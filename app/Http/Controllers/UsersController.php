<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use App\Models\Users;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    /**
     * getUsers - show view and CRUD of users
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function getUsers(Request $request): Response {
        $perPage = $request->input('per_page', 15);
        $idCompany = session('user')['id_company'];
        $errors = [];

        // ROW CREATE --------------------------------------
        $create = $request->input('create');

        if ($create) {

            if (User::where('email', $create['email'])->exists()) {
                array_push($errors, "Ya existe un usuario con ese email");
            } else {
                $user = User::create([
                    'name' => $create['name'],
                    'email' => $create['email'],
                    'id_company' => $idCompany,
                    'id_rol' => $create['id_rol']['id'] ?? (int)$create['id_rol'],
                    'password' => Hash::make($create['passw']),
                ]);

                activity('create user in')
                    ->causedBy(session('user')['id'],)
                    ->withProperties(['Nueva cuenta: ' => $user->only(['id', 'name', 'email'])])
                    ->log('Un admin registró un usuario');
            }

        }

        // ROW UPDATE --------------------------------------
        $update = $request->input('update');

        if ($update) {
            $userUpd = User::find($update['id']);

            if (!$userUpd) {
                array_push($errors, "El usuario no existe");
            } elseif (
                User::where('email', $update['email'])
                    ->where('id', '<>', $update['id'])
                    ->exists()
            ) {
                array_push($errors, "Ya existe un usuario con ese email");
            } else {
                $userUpd->name = $update['name'];
                $userUpd->email = $update['email'];
                $userUpd->id_rol = $update['id_rol']['id'] ?? (int) $update['id_rol'];

                $userUpd->save();
            }
        }

        // ROW DELETE --------------------------------------
        $id_delete = $request->input('id_delete');

        if($id_delete){
            $delete = Users::where('id', $id_delete)->delete();
        }
        //-------------------------------------------------

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

        $roles = Roles::where('id_company', $idCompany)->orderBy('id', 'desc')->get();

        return Inertia::render('Users', [
            'data' => $users,
            'roles' => $roles,
            'errors' => $errors
        ]);
    }
    /**
     * getUser
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUser(Request $request) {
        $id = $request->query('id');
        $user = Users::select('sys_users.*', 'sys_roles.name as role_name')
        ->leftJoin('sys_roles', 'sys_users.id_rol', '=', 'sys_roles.id')
        ->where('sys_users.id', $id)
        ->get();
        return response()->json($user);
    }

}

