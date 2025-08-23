<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Support\Facades\Auth;
use App\Models\ViewRolesPermissions;

use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    public function getUsers(): Response {
        $users = Users::select('id', 'name', 'email','created_at','updated_at')->orderBy('id', 'desc')->get();
        return Inertia::render('Users', [
            'data' => $users
        ]);
    }

    public function getRoles(): Response {
        $roles = ViewRolesPermissions::where('id_company',session('user')['id_company'])
         ->orderBy('id_rol', 'desc')
        ->get();
        return Inertia::render('Roles', [
            'data' => $roles
        ]);
    }
}

