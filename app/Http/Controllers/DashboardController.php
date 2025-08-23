<?php

namespace App\Http\Controllers;

use App\Models\Alerts;
use Inertia\Inertia;
use Inertia\Response;

use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function get(): Response {
        $alerts = Alerts::where('id_company', session('user')['id_company'])
        ->where(function ($query) {
            $query->whereNull('expire')
            ->orWhere('expire', '>', Carbon::now());
        })
        ->orderBy('created_at', 'desc')
        ->get();
        
        return Inertia::render('Dashboard',[
            'alerts' => $alerts
        ]);
    }

    public function alertUpdate(Request $request)
{
        if ($request->id == 0) {
            Alerts::deleteExpired();
            Alerts::create([
                'title' => $request->title,
                'type' => $request->type,
                'description' => $request->description,
                'id_company' => session('user')['id_company'],
                'expire' => $request->expire,
            ]);
        } else {
            $alert = Alerts::find($request->id);

            $alert->update([
                'title' => $request->title,
                'type' => $request->type,
                'description' => $request->description,
                'expire' => $request->expire,
            ]);

        }

        return redirect()->back()->with('success', 'Se ha actualizado la alerta');
    }

}

