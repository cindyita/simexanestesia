<?php

namespace App\Http\Controllers;

use App\Functions\UniqueKey;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\RegisterKeys;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Roles;

use Spatie\Activitylog\Models\Activity;

class AccountController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        activity('auth update')
            ->causedBy($request->user())
            ->withProperties(['Nombre'=>$request->user()->name])
            ->event($request->user()->id_company)
            ->log('Usuario editó su cuenta');

        return Redirect::route('account.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        activity('auth delete')
            ->causedBy($request->user())
            ->withProperties($request->user())
            ->event($request->user()->id_company)
            ->log('Usuario eliminó su cuenta');

        return Redirect::to('/');
    }

    public function getLogs(Request $request) {
        $isAdmin = session('user')['mode_admin'] ? true : false;
        $idUser = session('user')['id'];
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

    public function getSession(Request $request) {
        return $request->session()->all();
    }

    public function getRegisterKeys(Request $request) {
        $perPage = $request->input('per_page', 15);    
        $idCompany = session('user')['id_company'];

        $import = $request->input('imported',null);
        $id_rol = $request->input('id_rol',null);
        $email = $request->input('email',null);
        $note = $request->input('note',null);

        $type = $request->input('type',null);

        $lastId = RegisterKeys::where('id_company', $idCompany)->max('id');

        if($type == 'imported' && $import) {
            foreach ($import as $key => $value) {
                $lastId++;
                $clave = UniqueKey::getUniqueKey($value['email'], $lastId);
                $import[$key]['clave'] = $clave;
                RegisterKeys::create([
                    'key'        => $clave,
                    'note'       => $value['nota'] ?? ($value['note'] ?? null),
                    'email'      => $value['email'] ?? null,
                    'id_company' => $idCompany,
                    'id_rol'     => $id_rol,
                    'created_by' => session('user')['id'],
                    'created_at' => now(),
                ]);
            }
        }else if($type == 'unique' && $email){
            $lastId++;
            $import = [[]];
            $clave = UniqueKey::getUniqueKey($email, $lastId);
            $import[0]['email'] = $email;
            $import[0]['note'] = $note ?? null;
            $import[0]['clave'] = $clave ?? null;
            RegisterKeys::create([
                'key'        => $clave,
                'note'       => $note ?? null,
                'email'      => $email ?? null,
                'id_company' => $idCompany,
                'id_rol'     => $id_rol,
                'created_by' => session('user')['id'],
                'created_at' => now(),
            ]);
        }

        $roles = Roles::where('id_company', $idCompany)->orderBy('id', 'desc')->get();

        $keys = DB::table('reg_registerkeys as k')
        ->leftJoin('sys_roles as r', 'r.id', '=', 'k.id_rol')
        ->select(
            'k.id',
            'k.key',
            'k.note',
            'k.email',
            'k.id_company',
            'k.id_rol',
            'k.created_by',
            'k.created_at',
            'k.used_by',
            'k.used_at',
            'r.name as rol'
        )
        ->where('k.id_company', $idCompany)
        ->orderBy('k.id', 'desc')
        ->paginate($perPage);

        return Inertia::render('RegisterKeys', [
            'data' => $keys,
            'roles'=> $roles,
            'imported' => $import,
            'type' => $type ?? 0
        ]);
    }

}
