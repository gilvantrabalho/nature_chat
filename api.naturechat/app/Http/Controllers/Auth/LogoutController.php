<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    public function logout()
    {
        Auth::guard('api')->logout();

        return response()
            ->json(['message' => 'Logout realizado'])
            ->cookie(
                'token',
                '',
                -1,        // expira imediatamente
                '/',
                'localhost',
                false,
                true,
                false,
                'lax'
            );
    }
}
