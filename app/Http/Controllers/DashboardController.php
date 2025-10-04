<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Models\Alerts;
use Inertia\Inertia;
use Inertia\Response;


use Carbon\Carbon;
use Illuminate\Http\Request;

use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function get(Request $request) {

        $user = session('user');

        if(!$user){
            AuthenticatedSessionController::logout($request);
            return redirect()->route('login');
        }
        
        $alerts = Alerts::where('id_company', session('user')['id_company'])
        ->where(function ($query) {
            $query->whereNull('expire')
            ->orWhere('expire', '>', Carbon::now());
        })
        ->orderBy('created_at', 'desc')
        ->get();

        //--------STATS--------------------
        $idCompany = session('user')['id_company'];

        $companyStats = DB::table('view_company_stats')
        ->select('*')
        ->where('id_company', $idCompany)->first();

        $examStats = DB::table('view_exam_stats')
        ->select('*')
        ->where('id_company', $idCompany)->get();

        $HistoryStats = DB::table('view_history_stats')
        ->select('*')
        ->where('id_company', $idCompany)->get();
        //--------------------------------
        
        return Inertia::render('Dashboard',[
            'alerts' => $alerts,
            'company_stats'=> $companyStats,
            'exam_stats'=> $examStats,
            'history_stats' => $HistoryStats
        ]);
    }

    public function alertUpdate(Request $request)
{
        $crudtype = 'update';
        if ($request->id == 0) {
            Alerts::deleteExpired();
            Alerts::create([
                'title' => $request->title,
                'type' => $request->type,
                'description' => $request->description,
                'id_company' => session('user')['id_company'],
                'expire' => $request->expire,
            ]);
            $crudtype = 'create';
        } else {
            $alert = Alerts::find($request->id);

            $alert->update([
                'title' => $request->title,
                'type' => $request->type,
                'description' => $request->description,
                'expire' => $request->expire,
            ]);

        }

        activity($crudtype.' alert')
            ->causedBy($request->user())
            ->withProperties($alert)
            ->event($request->user()->id_company)
            ->log('Se actualizó el aviso en dashboard');

        return redirect()->back()->with('success', 'Se ha actualizado la alerta');
    }

}

