<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\RegisterKeys;
use App\Models\Roles;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\MenuService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     * @param mixed $key
     * @return \Inertia\Response
     */
    public function create($key = null): Response
    {   
        if($key){
            $registerkey = RegisterKeys::select('email', 'used_by')->where('key', $key)->first();
            if(!$registerkey || $registerkey['used_by']){
                return Inertia::render('ErrorPage',[
                'status' => 'invalid_key']);
            }
        }
        
        return Inertia::render('Auth/Register', [
            'key'=>$key,
            'email'=>$registerkey['email'] ?? null
        ]);
    }

    //------------------------------------------------------------
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:sys_users,email',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'register_key' => 'required|string'
            ]);

            if (User::where('email', $request->email)->exists()) {
                return Inertia::render('ErrorPage', [
                    'status' => 'email_used'
                ]);
            }

            $registerKeyData = $this->processRegisterKey($request);
            
            if (!$registerKeyData) {
                return Inertia::render('ErrorPage', [
                    'status' => 'invalid_key'
                ]);
            }

            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'id_company' => $registerKeyData['id_company'],
                'id_rol' => $registerKeyData['id_rol'],
                'password' => Hash::make($request->password),
            ]);

            if (isset($registerKeyData['key_id'])) {
                RegisterKeys::where('id', $registerKeyData['key_id'])
                    ->update(['used_by' => $user->id, 'used_at' => now()]);
            }

            event(new Registered($user));
            
            activity('create user')
                ->causedBy($user)
                ->withProperties(['Nueva cuenta: ' => $user->only(['id', 'name', 'email'])])
                ->log('Se registró un usuario');

            Auth::login($user);
            $this->setupUserSession($request, $user);

            DB::commit();

            return redirect(route('dashboard', absolute: false));

        } catch (ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en registro de usuario: ' . $e->getMessage(), [
                'email' => $request->email ?? 'N/A',
                'register_key' => $request->register_key ?? 'N/A'
            ]);
            
            return redirect()->back()
                ->withErrors(['msg' => 'Error interno.']);
        }
    }

    /**
     * Process register key
     * @param \Illuminate\Http\Request $request
     * @return array{id_company: mixed, id_rol: mixed, key_id: mixed, type: string|array{id_company: mixed, id_rol: mixed, type: string}|null}
     */
    private function processRegisterKey(Request $request)
    {
        $isDefaultKey = $request->boolean('default_key');
        $registerKey = $request->register_key;

        if ($isDefaultKey) {
            return $this->processIndividualKey($registerKey);
        }

        $company = Company::select('id as id_company', 'id_rol_register as id_rol', 'use_uniquekeys')
            ->where('register_key', $registerKey)
            ->first();

        if (!$company) {
            return $this->processIndividualKey($registerKey);
        }

        if ($company->use_uniquekeys) {
            return $this->processIndividualKey($registerKey);
        }

        return [
            'id_company' => $company->id_company,
            'id_rol' => $company->id_rol,
            'type' => 'company'
        ];
    }

    /**
     * processIndividualKey
     * @param string $key
     * @return array{id_company: mixed, id_rol: mixed, key_id: mixed, type: string|null}
     */
    private function processIndividualKey(string $key)
    {
        $registerKey = RegisterKeys::select('id', 'email', 'used_by', 'id_company', 'id_rol')
            ->where('key', $key)
            ->first();

        if (!$registerKey) {
            return null;
        }

        if ($registerKey->used_by) {
            return null;
        }

        return [
            'key_id' => $registerKey->id,
            'id_company' => $registerKey->id_company,
            'id_rol' => $registerKey->id_rol,
            'type' => 'individual'
        ];
    }

    /**
     * setupUserSession
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\User $user
     * @return void
     */
    private function setupUserSession(Request $request, User $user)
    {
        $role = Roles::select('mode_admin', 'name')
            ->where('id', $user->id_rol)
            ->first();

        $request->session()->put('user', [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'id_rol' => $user->id_rol,
            'rol_name' => $role->name ?? 'Sin rol',
            'mode_admin' => $role->mode_admin ?? false,
            'id_company' => $user->id_company,
        ]);

        $company = Company::find($user->id_company);
        if ($company) {
            $request->session()->put('company', $company);
        }

        $menuService = new MenuService();
        $menuService->setMenuInSession($user->id_rol);
    }
    //------------------------------------------------------------

    /**
     * storeByUser
     * @param \Illuminate\Http\Request $request
     * @return RedirectResponse
     */
    public function storeByUser(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        activity('create user')
            ->causedBy($request->user())
            ->withProperties(['Nueva cuenta: '=>$user])
            ->log('Usuario creó una cuenta');

        return redirect(route('dashboard', absolute: false));
    }
    
}

