<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Resources;
use App\Models\Subjects;
use Illuminate\Support\Facades\Auth;
use App\Models\ViewRolesPermissions;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function getAppSettings(Request $request): Response {
        $idCompany = session('user')['id_company'];
        $company = Company::where('id', $idCompany)->first();

        return Inertia::render('AppSettings', [
            'data' => $company
        ]);
    }

}

