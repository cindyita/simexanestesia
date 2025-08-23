<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuPermissionMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, $menuId = null)
    {
        if ($menuId) {
            $userMenu = session('user_menu', []);

            if (!array_key_exists($menuId, $userMenu)) {
                return Inertia::render('Error403');
            }
        }

        return $next($request);
    }
}
