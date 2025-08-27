<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Roles;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Session;
use App\Services\MenuService;
use App\Models\Company;

class AuthenticatedSessionController extends Controller
{

    protected $menuService;

    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

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

        $company = Company::where("id", $user->id_company)->get();

        $request->session()->put('company', $company[0]);

        $this->menuService->setMenuInSession($user->id_rol);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function refreshMenu()
    {

        $menu = $this->menuService->setMenuInSession(
            session('id_rol'),
            session('id_company')
        );

        return response()->json([
            'success' => true,
            'menu' => $menu
        ]);
    }
}
