<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Support\Facades\Auth;
use App\Models\ViewRolesPermissions;

use Inertia\Inertia;
use Inertia\Response;

class ExamsController extends Controller
{
    public function get(): Response {
        // $users = Users::select('id', 'name', 'email','created_at','updated_at')->orderBy('id', 'desc')->get();

        return Inertia::render('Exams', [
            // 'data' => $users
        ]);
    }

    public function getHistory(): Response {
        // $roles = ViewRolesPermissions::where('id_company',session('user')['id_company'])
        //  ->orderBy('id_rol', 'desc')
        // ->get();
        return Inertia::render('History', [
            // 'data' => $roles
        ]);
    }
}

