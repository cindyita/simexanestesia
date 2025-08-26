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
    Route::get('/logs', [AccountController::class, 'getLogs'])->name('logs');
    Route::get('/roles', [UsersController::class, 'getRoles'])->name('roles');
    Route::get('/exams', [ExamsController::class, 'get'])->name('exams');
    Route::get('/newexam', [ExamsController::class, 'createExam'])->name('newexam');
    Route::get('/history', [ExamsController::class, 'getHistory'])->name('history');
    Route::get('/resources', [ResourcesController::class, 'get'])->name('resources');

    //dashboard ----------------------
    Route::post('/alert', [DashboardController::class, 'alertUpdate'])->name('alert.update');
});

Route::get('/session', [AccountController::class, 'getSession']);

require __DIR__.'/auth.php';
