<?php

namespace App\Http\Controllers;

use App\Models\Exams;
use App\Models\History;
use Illuminate\Support\Facades\Auth;
use App\Models\ViewRolesPermissions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class ExamsController extends Controller
{
    public function get(Request $request): Response {
        $userId = session('user')['id'];

        $perPage = $request->input('per_page', 15);

        $exams = Exams::with(['subject','histories' => function($query) use ($userId) {
            $query->where('id_user', $userId)
                ->orderBy('completed_at', 'desc')
                ->limit(1);
        }])
        ->orderBy('id', 'desc')
        ->paginate($perPage)
        ->through(function ($exam) {
            $lastAttempt = $exam->histories->first();

            return [
                'id' => $exam->id,
                'name' => $exam->name,
                'subject' => $exam->subject->name ?? null,
                'description' => $exam->description,
                'timeLimit' => $exam->time_limit,
                'questionCount' => $exam->total_questions,
                'exam_type' => $exam->exam_type,
                'difficulty' => $exam->difficulty,
                'is_active' => $exam->is_active,
                'shuffle_questions' => $exam->shuffle_questions,
                'lastAttempt' => $lastAttempt ? [
                    'completed' => $lastAttempt->status === 'completed',
                    'score' => $lastAttempt->score,
                    'completedAt' => $lastAttempt->completed_at,
                    'timeUsed' => $lastAttempt->time_used,
                    'attempts' => $lastAttempt->attempt_number,
                ] : null
            ];
        });

        return Inertia::render('Exams', [
            'data' => $exams
        ]);
    }

    public function createExam(): Response {
        $isAdmin = session('user')['mode_admin'] ? true : false;
        if($isAdmin){
            return Inertia::render('CreateExam');
        }else{
            Log::stack(['single'])->info('Error 403 para id: '.session('user')['id']);
            return Inertia::render('ErrorPage',[
            'status' => '403']);
        }    
    }

    public function getHistory(Request $request): Response {
        $perPage = $request->input('per_page', 15);

        // ROW DELETE --------------------------------------
        $id_delete = $request->input('id_delete');

        if($id_delete){
            $delete = History::where('id', $id_delete)->delete();
        }
        //--------------------------------------------------

        $isAdmin = session('user')['mode_admin'] ? true : false;
        $idUser = session('user')['id'];
        $history = History::select(
            'reg_history.*',
            'reg_exams.name as exam_name',
            'sys_users.name as student_name',
        )
            ->join('reg_exams', 'reg_history.id_exam', '=', 'reg_exams.id')
            ->join('sys_users', 'reg_history.id_user', '=', 'sys_users.id')
            ->when(!$isAdmin, function($query) use ($idUser) {
                $query->where('reg_history.id_user', $idUser);
            })
            ->orderBy('reg_history.id', 'desc')
            ->paginate($perPage)
            ->through(function($item) {
                $data = $item->toArray();
                $data['score'] = number_format($item->score,0).'%';
                $data['time_used'] = $item->time_used.'min';
                return $data;
            });

        return Inertia::render('History', [
            'data' => $history
        ]);
    }

    public function getHistoryOne(Request $request) {
        $id = $request->query('id');

        $history = History::select(
                'reg_history.*',
                'reg_exams.name as exam_name',
                'sys_users.name as student_name',
            )
            ->join('reg_exams', 'reg_history.id_exam', '=', 'reg_exams.id')
            ->join('sys_users', 'reg_history.id_user', '=', 'sys_users.id')
            ->where("reg_history.id", $id)
            ->orderBy('reg_history.id', 'desc')
            ->first();

        $data = $history->toArray();
        $data['passed'] = $history->passed == 0 ? "No" : "Si";
        $data['score'] = $history->score."%";
        $data['time_used'] = $history->time_used."min";

        return response()->json([$data]);
    }


}

