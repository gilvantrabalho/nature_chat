<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Services\Format\PhoneService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function store(UserRequest $request)
    {
        $phone = (new PhoneService())->unformatPhone($request->telephone);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $phone,
            'password' => Hash::make($request->password),
        ]);

        $guard = Auth::guard('api');
        $token = $guard->login($user);

        return response()
            ->json(['user' => $user], 201)
            ->cookie(
                'token',
                $token,
                config('jwt.ttl'),
                '/',
                null,
                false,
                true,
                false,
                'lax'
            );
    }
}
