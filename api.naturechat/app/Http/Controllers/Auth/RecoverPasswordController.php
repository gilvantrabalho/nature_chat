<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\PasswordReset;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Mockery\Generator\StringManipulation\Pass\Pass;

class RecoverPasswordController extends Controller
{
    public function sendMailRecovery(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $emailUser = User::where('email', $request->input('email'))->first();

        if (!$emailUser) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        $code = bin2hex(random_bytes(16));

        $link = env('FRONT') . "alterar-senha?token=" . $code;

        PasswordReset::create([
            'user_id'    => $emailUser->id,
            'token' => $code,
            'expires_at' => now()->addMinutes(60),
        ]);

        Mail::raw("Clique no link para recuperar sua senha: {$link}", function ($message) use ($request) {
            $message->to($request->input('email'))
                ->subject('Recuperação de Senha');
        });

        return response()->json(['message' => 'E-mail de recuperação enviado com sucesso.']);
    }

    public function verifyToken(string $token)
    {
        $passwordReset = PasswordReset::where('token', $token)->first();

        if (!$passwordReset || $passwordReset->expires_at < now()) {
            return response()->json(['message' => 'Token inválido ou expirado.'], 400);
        }

        return response()->json(['message' => 'Token válido.']);
    }

    public function createNewPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $passwordReset = PasswordReset::where('token', $request->input('token'))->first();

        if (!$passwordReset || $passwordReset->expires_at < now()) {
            return response()->json(['message' => 'Token inválido ou expirado.'], 400);
        }

        $user = User::find($passwordReset->user_id);
        $user->password = bcrypt($request->input('password'));
        $user->save();

        // Delete the used token
        $passwordReset->delete();

        return response()->json(['message' => 'Senha redefinida com sucesso.']);
    }
}
