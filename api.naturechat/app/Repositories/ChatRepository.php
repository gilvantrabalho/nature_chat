<?php

namespace App\Repositories;

use App\Models\Chat\Chat;
use Illuminate\Support\Facades\Auth;

class ChatRepository
{
    public function getChatsUser()
    {
        $userId = Auth::guard('api')->id();

        return Chat::with([
            'participants:id,name',
            'lastMessage.user:id,name',
        ])
            ->whereHas('participants', function ($q) use ($userId) {
                $q->where('users.id', $userId);
            })
            ->orderByDesc('updated_at')
            ->get();
    }
}
