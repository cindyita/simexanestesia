<?php

namespace App\Http\Controllers;

use App\Mail\RegisterKeyMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class EmailsController extends Controller {
    /**
     * sendRegisterKeys
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sendRegisterKeys(Request $request) {
        $data = $request->validate([
            'keys' => 'required|array',
            'keys.*.email' => 'required|email',
            'keys.*.clave' => 'required|string',
        ]);

        foreach ($data['keys'] as $item) {
            Mail::to($item['email'])->send(new RegisterKeyMail($item['clave']));
        }

        activity('send emails')
            ->causedBy($request->user())
            ->event($request->user()->id_company)
            ->log('Envío de claves de registro por email');

        return back()->with('success', 'Claves enviadas correctamente');
    }

}

