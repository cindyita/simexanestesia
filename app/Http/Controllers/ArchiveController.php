<?php

namespace App\Http\Controllers;

use App\Models\Subjects;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ArchiveController extends Controller
{

    public function getLogs(Request $request) {
        $isAdmin = session('user')['mode_admin'] ? true : false;
        $idUser = session('user')['id'];

        // ROW DELETE --------------------------------------
        $id_delete = $request->input('id_delete');

        if($id_delete){
            Activity::where('id', $id_delete)->delete();
        }

        $perPage = $request->input('per_page', 15);
        $logs = Activity::select('activity_log.*','sys_users.name')
        ->leftJoin('sys_users', 'sys_users.id', '=', 'activity_log.causer_id')
        ->where('activity_log.event',session('user')['id_company'])
        ->when(!$isAdmin, function($query) use ($idUser) {
                $query->where('reg_history.id_user', $idUser);
            })
        ->orderBy('activity_log.id', 'desc')
        ->paginate($perPage);

        return Inertia::render('Logs', [
            'data' => $logs
        ]);
    }

    public function getLog(Request $request) {
        $id = $request->query('id');

        $log = Activity::select('activity_log.*','sys_users.name as name_user_causer')
        ->leftJoin('sys_users', 'sys_users.id', '=', 'activity_log.causer_id')
        ->where('activity_log.id',$id)
        ->get();

        return response()->json($log);
    }

    public function getSubjects(Request $request) {
        $perPage = $request->input('per_page', 15);
        $idCompany = session('user')['id_company'];

        // ROW CREATE --------------------------------------
        $create = $request->input('create');

        if ($create) {
            $create['id_company'] = $idCompany;
            array_unshift($create, 'id');
            $role = Subjects::create($create);
        }

        // ROW UPDATE --------------------------------------
        $update = $request->input('update');

        if($update){
            $role = Subjects::find($update['id']);
            $role->name = $update['name'];
            $role->code = $update['code'];
            $role->description = $update['description'];
            $role->save();
        }

        // ROW DELETE --------------------------------------
        $id_delete = $request->input('id_delete');

        if($id_delete){
            $delete = Subjects::where('id', $id_delete)->delete();
        }
        //--------------------------------------------------

        $subjects = Subjects::where('id_company',$idCompany)
            ->orderBy('id', 'desc')
            ->paginate($perPage);

        return Inertia::render('Subjects', [
            'data' => $subjects
        ]);
    }

    public function getSubject(Request $request) {
        $id = $request->query('id');

        $log = Subjects::where('id',$id)
        ->get();

        return response()->json($log);
    }

}

