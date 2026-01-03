<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SocketService
{
    public static function emitEvent($event, $data)
    {
        if (!$event || !$data) {
            return response()->json(['error' => 'Nome do evento e dados são obrigatórios'], 400);
        }

        $response = Http::withOptions([
            'verify' => false,
        ])->post('https://socket.triunfedigital.com.br/' . 'emit', [
            'eventName' => $event,
            'data' => $data
        ]);

        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json(['error' => 'Falha ao emitir o evento'], 500);
        }
    }
}
