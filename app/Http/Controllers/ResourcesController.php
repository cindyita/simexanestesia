<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Support\Facades\Auth;
use App\Models\ViewRolesPermissions;

use Inertia\Inertia;
use Inertia\Response;

class ResourcesController extends Controller
{
    public function get(): Response {
        // $users = Users::select('id', 'name', 'email','created_at','updated_at')->orderBy('id', 'desc')->get();

        return Inertia::render('Resources', [
            // 'data' => $users
        ]);
    }

}

