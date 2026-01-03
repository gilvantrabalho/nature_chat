<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtFromCookie
{
    public function handle($request, Closure $next)
    {
        if ($request->hasCookie('token')) {
            JWTAuth::setToken($request->cookie('token'));
        }

        return $next($request);
    }
}
