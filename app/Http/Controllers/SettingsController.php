<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Resources;
use App\Models\Roles;
use App\Models\Subjects;
use Illuminate\Support\Facades\Auth;
use App\Models\ViewRolesPermissions;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function getAppSettings(Request $request): Response {
        $req = $request->all();
        $idCompany = session('user')['id_company'];

        if($req && isset($req['settings']) && $req['settings'] == true){
            $company = Company::find($idCompany);

            $reqnew = Arr::except($req, ['settings', 'url', 'logo', 'icon']);

            if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
                if ($company->logo && Storage::disk('public')->exists($company->logo)) {
                    Storage::disk('public')->delete($company->logo);
                }
                $path = $request->file('logo')->store('img/logos', 'public');
                $reqnew['logo'] = $path;
            } else {
                $reqnew['logo'] = $company->logo;
            }

            if ($request->hasFile('icon') && $request->file('icon')->isValid()) {
                if ($company->icon && Storage::disk('public')->exists($company->icon)) {
                    Storage::disk('public')->delete($company->icon);
                }
                $path = $request->file('icon')->store('img/icons', 'public');
                $reqnew['icon'] = $path;
            } else {
                $reqnew['icon'] = $company->icon;
            }

            $company->update($reqnew);

            $request->session()->put('company', $reqnew);
        }

        $company = Company::where('id', $idCompany)->first();
        $roles = Roles::where('id_company', $idCompany)->orderBy('id', 'desc')->get();

        return Inertia::render('AppSettings', [
            'data' => $company,
            'roles' => $roles
        ]);
    }


}

