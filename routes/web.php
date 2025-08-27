<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ExamsController;
use App\Http\Controllers\ResourcesController;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Session;

// RUTAS --------------------------

Route::get('/', [DashboardController::class,'get'])->middleware(['auth', 'verified'])->name('dashboard');

//---------------------------------
// IDIOMA -------------------------
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
    Route::get('/users', [UsersController::class, 'getUsers'])->middleware(['menu.permission:6'])->name('users');
    Route::get('/logs', [AccountController::class, 'getLogs'])->middleware(['menu.permission:8'])->name('logs');
    Route::get('/roles', [UsersController::class, 'getRoles'])->middleware(['menu.permission:7'])->name('roles');
    Route::get('/exams', [ExamsController::class, 'get'])->middleware(['menu.permission:2'])->name('exams');
    Route::get('/newexam', [ExamsController::class, 'createExam'])->middleware(['menu.permission:2'])->name('newexam');
    Route::get('/history', [ExamsController::class, 'getHistory'])->middleware(['menu.permission:3'])->name('history');
    Route::get('/resources', [ResourcesController::class, 'get'])->middleware(['menu.permission:4'])->name('resources');

    //dashboard ----------------------
    Route::post('/alert', [DashboardController::class, 'alertUpdate'])->name('alert.update');

    // extraAPIS---------------------------
    Route::post('/getRolPermission', [UsersController::class, 'getRolPermission'])->name('getRolPermission');
});

Route::get('/session', [AccountController::class, 'getSession']);

require __DIR__.'/auth.php';
