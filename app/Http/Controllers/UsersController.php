<?php

namespace App\Http\Controllers;

use App\Models\Users;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ViewRolesPermissions;

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

    public function getRoles(Request $request): Response {
        $perPage = $request->input('per_page', 15);
        
        $roles = ViewRolesPermissions::where('id_company',session('user')['id_company'])
        ->orderBy('id_rol', 'desc')
        ->paginate($perPage);

        return Inertia::render('Roles', [
            'data' => $roles
        ]);
    }

    public function getRolPermission(Request $request) {
        $idRol = $request->input('id');

        $permissions = Menu::select(
            'sys_menu.id',
            'sys_menu.name',
            'sys_menu.url',
            'sys_menu.menu_level',
            'sys_menu.id_parent',
            DB::raw('COALESCE(sys_permissions.level, NULL) as level'))
            ->leftJoin('sys_permissions', function($join) use ($idRol) {
                $join->on('sys_permissions.id_menu', '=', 'sys_menu.id')
                    ->where('sys_permissions.id_rol', '=', $idRol);
            })
            ->orderBy('sys_menu.reg_order', 'asc')
            ->get();

        return response()->json([
            'permissions' => $permissions
        ]);
    }

}

