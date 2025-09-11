<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    public function getUsers(Request $request): Response {
        $perPage = $request->input('per_page', 15);

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
            ->paginate($perPage);

        return Inertia::render('Users', [
            'data' => $users
        ]);
    }

}

