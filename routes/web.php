<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\ExamsController;
use App\Http\Controllers\ResourcesController;
use App\Http\Controllers\EmailsController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Session;

// ID MENUS
const idMenu = [
    'dashboard' => 1,
    'exams' => 2,
    'history' => 3,
    'resources' => 4,
    'admin' => 6, // PARENT
    'users' => 7,
    'roles' => 8,
    'registerkeys' => 10,
    'records' => 11, // PARENT
    'logs' => 12,
    'settings' => 14
];

// ROUTES --------------------------
Route::get('/', [DashboardController::class,'get'])->middleware(['auth', 'verified'])->name('dashboard');

//---------------------------------
// LANGUAGE -------------------------
Route::get('lang/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'es'])) {
        Session::put('locale', $locale);
    }
    return redirect()->back();
})->name('lang.switch');
//----------------------------------

Route::middleware('auth')->group(function () {
    // PROFILE ----------------------
    Route::get('/account', [AccountController::class, 'edit'])->name('account.edit');

    Route::patch('/account', [AccountController::class, 'update'])->name('account.update');

    Route::delete('/account', [AccountController::class, 'destroy'])->name('account.destroy');

    // PAGES ------------------------
    Route::get('/exams', [ExamsController::class, 'get'])->middleware(['menu.permission:'.idMenu['exams']])->name('exams');

    Route::get('/newexam', [ExamsController::class, 'createExam'])->middleware(['menu.permission:'.idMenu['exams']])->name('newexam');

    Route::get('/history', [ExamsController::class, 'getHistory'])->middleware(['menu.permission:'.idMenu['history']])->name('history');

    Route::get('/resources', [ResourcesController::class, 'get'])->middleware(['menu.permission:'.idMenu['resources']])->name('resources');

    Route::get('/users', [UsersController::class, 'getUsers'])->middleware(['menu.permission:'.idMenu['users']])->name('users');

    Route::get('/roles', [RolesController::class, 'getRoles'])->middleware(['menu.permission:'.idMenu['roles']])->name('roles');

    Route::get('/logs', [AccountController::class, 'getLogs'])->middleware(['menu.permission:'.idMenu['logs']])->name('logs');

    Route::get('/registerkeys/{show?}', [AccountController::class, 'getRegisterKeys'])->middleware(['menu.permission:'.idMenu['registerkeys']])->name('registerkeys');

    Route::get('/appsettings', [SettingsController::class, 'getAppSettings'])->middleware(['menu.permission:'.idMenu['settings']])->name('appsettings');

    // GET IN PAGES
    Route::get('/getLog', [AccountController::class, 'getLog'])->middleware(['menu.permission:'.idMenu['logs']])->name('getLog');
    
    // POST IN PAGES
    Route::post('/registerkeys', [AccountController::class, 'getRegisterKeys'])->middleware(['menu.permission:'.idMenu['registerkeys']])->name('registerkeys');

    Route::post('/appsettings', [SettingsController::class, 'getAppSettings'])->middleware(['menu.permission:'.idMenu['settings']])->name('appsettings');

    Route::post('/getRolPermission', [RolesController::class, 'getRolPermission'])->middleware(['menu.permission:'.idMenu['roles']])->name('getRolPermission');

    Route::post('/roles', [RolesController::class, 'getRoles'])->middleware(['menu.permission:'.idMenu['roles']])->name('roles');

    // DASHBOARD ----------------------
    Route::post('/alert', [DashboardController::class, 'alertUpdate'])->name('alert.update');

    // EMAILS------------------------------
    Route::post('/registerkeys/send', [EmailsController::class, 'sendRegisterKeys'])->middleware(['menu.permission:'.idMenu['registerkeys']])->name('registerkeys.send');
});

Route::get('/session', [AccountController::class, 'getSession']);

require __DIR__.'/auth.php';
