<?php

namespace App\Http\Controllers;

use App\Mail\RegisterKeyMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class EmailsController extends Controller {
    public function sendRegisterKeys(Request $request)
    {
        $data = $request->validate([
            'keys' => 'required|array',
            'keys.*.email' => 'required|email',
            'keys.*.clave' => 'required|string',
        ]);

        foreach ($data['keys'] as $item) {
            Mail::to($item['email'])->send(new RegisterKeyMail($item['clave']));
        }

        return back()->with('success', 'Claves enviadas correctamente');
        // return response()->json($request->all());
    }

}

