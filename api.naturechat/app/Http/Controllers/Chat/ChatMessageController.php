<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Http\Requests\MessageRequest;
use App\Models\Chat\Chat;
use App\Models\Chat\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatMessageController extends Controller
{
    public function index(Chat $chat)
    {
        return response()->json($chat->load('messages.user'));
    }

    public function store(MessageRequest $messageRequest)
    {
        $chatMessage = ChatMessage::create([
            'chat_id' => $messageRequest->chat_id,
            'user_id' => Auth::guard('api')->user()->id,
            'message' => $messageRequest->message,
            'type' => $messageRequest->type,
        ]);

        return response()->json($chatMessage->load('user'));
    }
}
