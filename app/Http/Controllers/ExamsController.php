<?php

namespace App\Http\Controllers;

use App\Models\Exams;
use App\Models\ExamsQuestions;
use App\Models\History;
use App\Models\Subjects;
use Illuminate\Support\Facades\Auth;
use App\Models\ViewRolesPermissions;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

/**
 * ExamsController and HistoryController
 */
class ExamsController extends Controller
{
    /**
     * Show view exams and CRUD
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function get(Request $request): Response {
        $userId = session('user')['id'];

        // ROW DELETE --------------------------------------
        $id_delete = $request->input('id_delete');

        if($id_delete){
            ExamsQuestions::where('id_exam', $id_delete)->delete();
            Exams::where('id', $id_delete)->delete();
        }
        //-------------------------------------------------

        $perPage = $request->input('per_page', 15);

        $exams = Exams::with(['subject','histories' => function($query) use ($userId) {
            $query->where('id_user', $userId)
                ->orderBy('id', 'desc')
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
                'max_attempts' => $exam->max_attempts,
                'shuffle_questions' => $exam->shuffle_questions,
                'is_active' => $exam->is_active,
                'show_results' => $exam->show_results,
                'lastAttempt' => $lastAttempt ? [
                    'completed' => $lastAttempt->status === 'completed',
                    'score' => $lastAttempt->score,
                    'startedAt' => $lastAttempt->started_at,
                    'completedAt' => $lastAttempt->completed_at,
                    'timeUsed' => $lastAttempt->time_used,
                    'attempts' => $lastAttempt->attempt_number,
                    'answers' => json_decode($lastAttempt->answers,true),
                ] : null
            ];
        });

        return Inertia::render('Exams', [
            'data' => $exams
        ]);
    }

    /**
     * getExam
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getExam(Request $request) {
        $id = $request->input('id');

        $exam = Exams::select(
            'reg_exams.*',
            'reg_subjects.name as subject',
            'sys_users.name as created_by_name',
        )
            ->join('reg_subjects', 'reg_exams.id_subject', '=', 'reg_subjects.id')
            ->join('sys_users', 'reg_exams.created_by', '=', 'sys_users.id')
            ->where('reg_exams.id', $id)->first();
        
        switch ($exam['exam_type']) {
            case 'multiple_choice':
                $exam['exam_type_show'] = "Opción múltiple";
            break;
            case 'true_false':
                $exam['exam_type_show'] = "Verdadero/Falso";
            break;
            case 'essay':
                $exam['exam_type_show'] = "Desarrollo";
            break;
            case 'mixed':
                $exam['exam_type_show'] = "Mixto";
            break;
            default:
                $exam['exam_type_show'] = $exam['exam_type'];
            break;
        }

        switch ($exam['difficulty']) {
            case 'basic':
                $exam['difficulty_show'] = "Básica";
            break;
            case 'intermediate':
                $exam['difficulty_show'] = "Intermedia";
            break;
            case 'advanced':
                $exam['difficulty_show'] = "Avanzada";
            break;
            default:
                $exam['difficulty_show'] = $exam['difficulty'];
            break;
        }

        $exam['time_limit_show'] = $exam['time_limit'] . ' min';
        $exam['passing_score_show'] = $exam['passing_score'] . '%';
        $exam['is_active_show'] = $exam['is_active'] ? "Si" : "No";

        $questions = ExamsQuestions::where('id_exam', $id)->orderBy('order')->get();

        $exam['questions'] = $questions;

        return response()->json([$exam]);
    }
    /**
     * getExamQuestions
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getExamQuestions(Request $request) {
        $id = $request->input('id');

        $questions = ExamsQuestions::where('id_exam', $id)->orderBy('order')->get();

        return response()->json($questions);
    }
    /**
     * show view create exam
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function createExam(Request $request): Response {
        $isAdmin = session('user')['mode_admin'] ? true : false;
        $idCompany = session('user')['id_company'];
        $edit = $request->input('edit');

        if($isAdmin) {
            $subjects = Subjects::select("id","name","code")
            ->where("id_company",$idCompany)->get();

            return Inertia::render('CreateExam',[
                'subjects'=>$subjects,
                'edit' => $edit
            ]);
        } else {
            Log::stack(['single'])->info('Error 403 para id: '.session('user')['id']);
            return Inertia::render('ErrorPage',[
            'status' => '403']);
        }    
    }
    /**
     * saveExam - CREATE AND UPDATE
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse|\Inertia\Response
     */
    public function saveExam(Request $request) {
        $id = session('user')['id'];
        $isAdmin = session('user')['mode_admin'] ? true : false;
        $idCompany = session('user')['id_company'];

        $examData = $request->input('exam');

        if (!$isAdmin) {
            Log::stack(['single'])->info('Error 403 para id: ' . session('user')['id']);
            return Inertia::render('ErrorPage', [
                'status' => '403'
            ]);
        }

        $edit = $examData['edit'];

        //---------------------
        // UPDATE
        if ($edit && !empty($examData['id'])) {
            $exam = Exams::findOrFail($examData['id']);

            $exam->update([
                'name'              => $examData['name'],
                'description'       => $examData['description'],
                'id_subject'        => $examData['subject_id'],
                'created_by'        => $id,
                'time_limit'        => $examData['time_limit'],
                'total_questions'   => $examData['total_questions'],
                'exam_type'         => $examData['exam_type'],
                'difficulty'        => $examData['difficulty'],
                'passing_score'     => $examData['passing_score'],
                'max_attempts'      => $examData['max_attempts'],
                'shuffle_questions' => $examData['shuffle_questions'],
                'shuffle_options'   => $examData['shuffle_options'],
                'is_active'         => $examData['is_active'],
                'show_results'      => $examData['show_results'],
                'id_company'        => $idCompany
            ]);

            // Manejo de preguntas (update o create)
            if (!empty($examData['questions'])) {
                foreach ($examData['questions'] as $questionData) {
                    if (!empty($questionData['id'])) {
                        $question = ExamsQuestions::find($questionData['id']);
                        if ($question) {
                            $question->update([
                                'question'        => $questionData['question'],
                                'question_type'   => $questionData['question_type'],
                                'options'         => json_encode($questionData['options']),
                                'correct_answers' => json_encode($questionData['correct_answers']),
                                'explanation'     => $questionData['explanation'],
                                'order'           => $questionData['order'],
                                'image_path'      => $questionData['image_path'] ?? null,
                                'audio_path'      => $questionData['audio_path'] ?? null,
                                'is_active'       => $questionData['is_active'] ?? true,
                            ]);
                        }
                    } else {
                        ExamsQuestions::create([
                            'id_exam'         => $exam->id,
                            'question'        => $questionData['question'],
                            'question_type'   => $questionData['question_type'],
                            'options'         => json_encode($questionData['options']),
                            'correct_answers' => json_encode($questionData['correct_answers']),
                            'explanation'     => $questionData['explanation'],
                            'order'           => $questionData['order'],
                            'image_path'      => $questionData['image_path'] ?? null,
                            'audio_path'      => $questionData['audio_path'] ?? null,
                            'is_active'       => $questionData['is_active'] ?? true,
                        ]);
                    }
                }
            }

            return response()->json([
                'message' => 'Examen actualizado correctamente',
                'exam_id' => $exam->id
            ], 200);
        }

        $exam = Exams::create([
            'name'              => $examData['name'],
            'description'       => $examData['description'],
            'id_subject'        => $examData['subject_id'],
            'created_by'        => $id,
            'time_limit'        => $examData['time_limit'],
            'total_questions'   => $examData['total_questions'],
            'exam_type'         => $examData['exam_type'],
            'difficulty'        => $examData['difficulty'],
            'passing_score'     => $examData['passing_score'],
            'max_attempts'      => $examData['max_attempts'],
            'shuffle_questions' => $examData['shuffle_questions'],
            'shuffle_options'   => $examData['shuffle_options'],
            'is_active'         => $examData['is_active'],
            'show_results'      => $examData['show_results'],
            'id_company'        => $idCompany
        ]);

        if (!empty($examData['questions'])) {
            foreach ($examData['questions'] as $questionData) {
                ExamsQuestions::create([
                    'id_exam'         => $exam->id,
                    'question'        => $questionData['question'],
                    'question_type'   => $questionData['question_type'],
                    'options'         => json_encode($questionData['options']),
                    'correct_answers' => json_encode($questionData['correct_answers']),
                    'explanation'     => $questionData['explanation'],
                    'order'           => $questionData['order'],
                    'image_path'      => $questionData['image_path'] ?? null,
                    'audio_path'      => $questionData['audio_path'] ?? null,
                    'is_active'       => true,
                ]);
            }
        }

        return response()->json([
            'exam_id' => $exam->id
        ], 200);
    }
    /**
     * show view startExam
     * @param mixed $id
     * @return \Inertia\Response
     */
    public function startExam($id) {
        $idUser = session('user')['id'];
        $exam = Exams::select(
            'reg_exams.*',
            'reg_subjects.name as subject',
            'sys_users.name as created_by_name',
        )
            ->join('reg_subjects', 'reg_exams.id_subject', '=', 'reg_subjects.id')
            ->join('sys_users', 'reg_exams.created_by', '=', 'sys_users.id')
            ->where('reg_exams.id', $id)->first();
        
        $lastAttempt = History::where('id_exam', $id)
        ->where('id_user', $idUser)
        ->orderBy('attempt_number', 'desc')
        ->first();

        $exam->last_attempt = $lastAttempt ? $lastAttempt : [];

        $questions = ExamsQuestions::where('id_exam', $id)->orderBy('order')->get();

        $exam['questions'] = $questions;

        return Inertia::render('StartExam', [
            'data' => $exam
        ]);
    }
    /**
     * finishExam
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function finishExam(Request $request) {
        $idHistory = $request->input('id');
        $idUser = session('user')['id'];

        $data = $request->input('completehistory');

        $history = History::where('id', $idHistory)
            ->where('id_user', $idUser)
            ->first();

        if (!$history) {
            return response()->json([
                'status'  => 404
            ]);
        }

        $minScore = $request->input('minScore');

        $userAnswers = $data['answers'] ?? json_decode($history->answers, true);

        $questions = ExamsQuestions::where('id_exam', $history->id_exam)
            ->get();

        $totalQuestions = $questions->count();
        $correctCount = 0;

        foreach ($questions as $q) {
            $correctAnswers = json_decode($q->correct_answers, true); // array con respuestas correctas
            $userAnswer = $userAnswers[$q->id] ?? null;

            if ($userAnswer !== null) {
                if (is_array($userAnswer)) {
                    sort($userAnswer);
                    sort($correctAnswers);
                    if ($userAnswer === $correctAnswers) {
                        $correctCount++;
                    }
                } else {
                    if (in_array($userAnswer, $correctAnswers)) {
                        $correctCount++;
                    }
                }
            }
        }

        $score = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100, 2) : 0;

        $passed = $score >= $minScore ? 1 : 0;

        $history->update([
            'status'          => 'completed',
            'completed_at'    => now(),
            'time_used'       => $data['time_used'] ?? $history->time_used,
            'score'           => $score,
            'correct_answers' => $correctCount,
            'passed'          => $passed,
            'answers'         => json_encode($userAnswers),
            'ip_address'      => $request->ip(),
            'user_agent'      => $request->userAgent()
        ]);

        return response()->json([
            'status'  => 200,
            'message' => 'Examen finalizado',
            'score'   => $score,
            'passed'  => $passed
        ]);
    }
    /**
     * getExamStatus - json reponse of status time of the user in exam
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getExamStatus(Request $request){
        $startedAt = $request->input('started_at');
        $timeLimit = $request->input('time_limit');

        $start = Carbon::parse($startedAt)->setTimezone('UTC');
        $now = Carbon::now('UTC');

        $timeUsed = $start->diffInSeconds($now);
        $timeRemaining = max($timeLimit*60 - $timeUsed, 0);

        $status = $timeRemaining <= 0 ? 'expired' : 'in_progress';

        return response()->json([
            'status' => $status,
            'time_used' => $timeUsed,
            'time_remaining' => $timeRemaining,
        ]);
    }
    /**
     * getHistory - CRUD and view history
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function getHistory(Request $request, $idExam = null, $nameExam = null): Response {
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
            ->when($idExam, function($query) use ($idExam) {
                $query->where('reg_history.id_exam', $idExam);
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
            'data' => $history,
            'nameExam'=> $nameExam
        ]);
    }
    /**
     * getHistoryByExam
     * @param mixed $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHistoryByExam($id){
        $idUser = session('user')['id'];
        $history = History::select(
            'reg_history.*',
            'sys_users.name as student_name',
        )
            ->join('sys_users', 'reg_history.id_user', '=', 'sys_users.id')
            ->where('reg_history.id_exam',$id)
            ->where('reg_history.id_user',$idUser)
            ->orderBy('reg_history.id', 'desc')->get();
        
        return response()->json($history);
    }
    /**
     * getHistoryOne
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
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
    /**
     * createHistory
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createHistory(Request $request) {
        $idExam = $request->input('id'); //idexam
        $idUser = session('user')['id'];
        $idCompany = session('user')['id_company'];

        $numAttempt = $request->input('numAttempt');
        $attemptNumber = $numAttempt ? $numAttempt + 1 : 1;

        $data = $request->input('newhistory');

        $existingHistory = History::where('id_user', $idUser)
            ->where('id_exam', $idExam)
            ->where('status', 'in_progress')
            ->first();

        if ($existingHistory) {
            $existingHistory->update([
                'time_used'       => $data['time_used'] ?? $existingHistory->time_used,
                'answers'         => json_encode($data['answers'] ?? json_decode($existingHistory->answers, true) ?? []),
                'ip_address'      => $request->ip(),
                'user_agent'      => $request->userAgent(),
                'updated_at'      => now()
            ]);

            $history = $existingHistory;
        } else {
            $history = History::create([
                'id_user'         => $idUser,
                'id_exam'         => $idExam,
                'attempt_number'  => $attemptNumber,
                'status'          => $data['status'] ?? 'in_progress',
                'started_at'      => now(),
                'completed_at'    => $data['completed_at'] ?? null,
                'time_used'       => $data['time_used'] ?? null,
                'score'           => $data['score'] ?? 0,
                'correct_answers' => $data['correct_answers'] ?? 0,
                'passed'          => $data['passed'] ?? false,
                'answers'         => json_encode($data['answers'] ?? []),
                'question_order'  => json_encode($data['question_order'] ?? []),
                'ip_address'      => $request->ip(),
                'user_agent'      => $request->userAgent(),
                'metadata'        => json_encode([]),
                'id_company'      => $idCompany
            ]);
        }

        return response()->json(['id'=> $history->id,'answers'=>$history->answers]);
    }
    /**
     * updateHistory
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateHistory(Request $request) {
        $idHistory = $request->input('id');
        $idUser = session('user')['id'];

        $data = $request->input('updatehistory');

        $history = History::where('id', $idHistory)
            ->where('id_user', $idUser)
            ->first();

        if (!$history) {
            return response()->json([
                'status'  => 404
            ]);
        }

        $history->update([
            'time_used'  => $data['time_used'] ?? $history->time_used,
            'answers'    => json_encode($data['answers'] ?? json_decode($history->answers, true)),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status'  => 200,
            'message' => 'Intento actualizado'
        ]);
    }





}

