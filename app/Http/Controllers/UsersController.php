<?php

namespace App\Http\Controllers;

use App\Models\Permissions;
use App\Models\RegisterKeys;
use App\Models\Users;
use Illuminate\Support\Facades\Auth;
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

        $permissions = DB::table('sys_menu as m')
            ->leftJoin('sys_permissions as p', function($join) use ($idRol) {
                $join->on('m.id', '=', 'p.id_menu')
                    ->where('p.id_rol', '=', $idRol);
            })
            ->select(
                'm.id',
                'm.name',
                DB::raw('COALESCE(p.level, NULL) as level')
            )
            ->orderBy('m.reg_order')
            ->get();

        return response()->json([
            'permissions' => $permissions
        ]);
    }

    public function getRegisterKeys(Request $request) {
        $perPage = $request->input('per_page', 15);
        
        $keys = RegisterKeys::where('id_company',session('user')['id_company'])
        ->orderBy('id', 'desc')
        ->paginate($perPage);

        return Inertia::render('RegisterKeys', [
            'data' => $keys
        ]);
    }
}

