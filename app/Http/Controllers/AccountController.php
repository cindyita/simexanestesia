<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

use Spatie\Activitylog\Models\Activity;

class AccountController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        activity('auth edit')
            ->causedBy($request->user())
            ->withProperties(['Nombre'=>$request->user()->name])
            ->event($request->user()->id_company)
            ->log('Usuario editó su cuenta');

        return Redirect::route('account.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        activity('auth delete')
            ->causedBy($request->user())
            ->withProperties($request->user())
            ->event($request->user()->id_company)
            ->log('Usuario eliminó su cuenta');

        return Redirect::to('/');
    }

    public function getLogs() {
        $logs = Activity::where('event',session('user')['id_company'])->orderBy('id', 'desc')->get();
        return Inertia::render('Logs', [
            'data' => $logs
        ]);
    }

    public function getSession(Request $request) {
        return $request->session()->all();
    }
}
