<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\Chat\ChatMessageController;
use App\Http\Controllers\Phone\PhoneController;
use App\Http\Middleware\JwtFromCookie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('login', [LoginController::class, 'login']);

Route::middleware(JwtFromCookie::class)->group(function () {
    Route::get('me', [LoginController::class, 'me']);
    Route::post('logout', [LogoutController::class, 'logout']);

    Route::prefix('phone')->controller(PhoneController::class)->group(function () {
        Route::get('verify', 'verify');
    });

    Route::prefix('chat')->group(function () {
        Route::controller(ChatController::class)->group(function () {
            Route::get('/', 'index');
            Route::post('create', 'store');
            Route::get('{chat}/participants', 'participants');
        });

            //`http://localhost:8000/api/chats/${chatId}/participants`
        // 

        Route::controller(ChatMessageController::class)->group(function() {
            Route::get('{chat}/message', 'index');
            Route::post('message/create', 'store');
        });
        
    });
});
