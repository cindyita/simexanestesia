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

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
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

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $registerkey = RegisterKeys::select('email', 'used_by','id_company','id_rol')->where('key', $request->register_key)->first();

        if(!$registerkey || $registerkey['used_by']){
            return Inertia::render('ErrorPage',[
            'status' => 'invalid_key']);
        }

        $emailunique = User::where('email', $request->email)->first();

        if($emailunique){
            return Inertia::render('ErrorPage',[
            'status' => 'email_used']);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:sys_users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'id_company'=>$registerkey->id_company,
            'id_rol'=>$registerkey->id_rol,
            'password' => Hash::make($request->password),
        ]);

        if (!$user) {
            return redirect()->back()->withErrors(['msg' => 'No se pudo crear el usuario. Intenta de nuevo.']);
        }

        event(new Registered($user));

        activity('auth create')
            ->causedBy($user)
            ->withProperties(['Nueva cuenta: '=>$user->only(['id','name','email'])])
            ->log('Se registró un usuario');

        Auth::login($user);

        //------------------------------
        $role = Roles::select('mode_admin','name')
        ->where('id', $user->id_rol)
        ->first();

        $request->session()->put('user', [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'id_rol' => $user->id_rol,
            'rol_name' => $role->name,
            'mode_admin' => $role->mode_admin,
            'id_company' => $user->id_company,
        ]);

        $company = Company::where("id", $user->id_company)->first();

        $request->session()->put('company', $company);
        $menu = new MenuService;
        $menu->setMenuInSession($user->id_rol);
        //------------------------------

        return redirect(route('dashboard', absolute: false));
    }

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

        activity('auth create')
            ->causedBy($request->user())
            ->withProperties(['Nueva cuenta: '=>$user])
            ->log('Usuario creó una cuenta');

        return redirect(route('dashboard', absolute: false));
    }
    
}

