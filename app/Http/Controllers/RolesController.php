<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Models\Menu;
use App\Models\Permissions;
use App\Models\Roles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ViewRolesPermissions;
use App\Services\MenuService;
use Inertia\Inertia;
use Inertia\Response;

class RolesController extends Controller
{

    public function getRoles(Request $request): Response {
        $permissions = $request->input('permissions');
        $idRol = $request->input('id_rol');

        if ($permissions && $idRol) {
            $changed = false;
            $delete = 0;
            foreach ($permissions as $value) {
                if ($value['level'] > 0) {
                    $permissionQuery = Permissions::updateOrCreate(
                        [
                            'id_rol'  => $idRol,
                            'id_menu' => $value['id'],
                        ],
                        [
                            'level'   => $value['level'],
                        ]
                    );
                } else {
                    $delete = Permissions::where('id_rol', $idRol)
                        ->where('id_menu', $value['id'])
                        ->delete();
                }
            }

            if($permissionQuery->wasChanged() || $delete > 0){
                AuthenticatedSessionController::refreshMenuInSession($idRol);

                activity('update permissions')
                    ->causedBy($request->user())
                    ->event($request->user()->id_company)
                    ->withProperties(['New permissions'=>$permissions])
                    ->log('Se modificaron los permisos del rol: '.$idRol);
            }

            if ($permissionQuery->wasRecentlyCreated) { $changed = true; }
            if ($delete > 0){ $changed = true; }

            if($changed){
                AccountController::closeAllRolSession($idRol);
            }
            
        }

        // ROW DELETE --------------------------------------
        $id_delete = $request->input('id_delete');

        if($id_delete){
            $delete = Roles::where('id', $id_delete)->delete();
        }

        //--------------------------------------------------------
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

