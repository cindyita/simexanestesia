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
        $users = Users::select(
                'sys_users.id',
                'sys_users.name',
                'sys_users.email',
                'sys_users.created_at',
                'sys_users.updated_at',
                'sys_roles.name as role_name'
            )
            ->leftJoin('sys_roles', 'sys_users.id_rol', '=', 'sys_roles.id')
            ->orderBy('sys_users.id', 'desc')
            ->get();

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

