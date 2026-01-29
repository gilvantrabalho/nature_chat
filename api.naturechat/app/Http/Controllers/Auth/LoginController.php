<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Format\PhoneService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required',
            'password' => 'required',
        ]);

        $request->merge([
            'phone' => (new PhoneService())->unformatPhone($request->phone)
        ]);

        $credentials = $request->only('phone', 'password');

        $guard = Auth::guard('api');

        if (! $token = $guard->attempt($credentials)) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        return response()
            ->json([
                'user' => $guard->user(),
            ])
            ->cookie(
                'token',
                $token,
                config('jwt.ttl'),
                '/',
                null,   // 👈 deixa null em dev
                false,
                true,   // httpOnly
                false,
                'lax'
            );
    }


    public function me()
    {
        return response()->json(Auth::user());
    }
}
