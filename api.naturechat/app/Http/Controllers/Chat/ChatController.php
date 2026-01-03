<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChatRequest;
use App\Models\Chat\Chat;
use App\Models\Chat\ChatMessage;
use App\Models\Chat\ChatParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Repositories\ChatRepository;

class ChatController extends Controller
{
    public function __construct(
        private ChatRepository $chatRepository
    ) {
        $this->chatRepository = $chatRepository;
    }

    public function index()
    {
        return response()->json(
            $this->chatRepository->getChatsUser()
        );
    }

    public function store(ChatRequest $request)
    {
        $authUser = Auth::guard('api')->user();

        return DB::transaction(function () use ($request, $authUser) {

            /**
             * 🔒 Participantes vindos do FormRequest
             */
            $participants = $request->participantIds();

            // 🔒 Garante que o usuário autenticado sempre participa
            $participants[] = $authUser->id;
            $participants = array_values(array_unique($participants));

            /**
             * 🔐 CHAT PRIVADO (evita duplicado)
             */
            if ($request->type === 'private') {

                $existingChat = Chat::where('type', 'private')
                    ->whereHas(
                        'participants',
                        fn($q) => $q->whereIn('users.id', $participants),
                        '=',
                        2
                    )
                    ->lockForUpdate()
                    ->first();

                if ($existingChat) {
                    $existingChat->load([
                        'participants:id,name',
                        'lastMessage.user'
                    ]);

                    return response()->json([
                        'chat' => $existingChat
                    ], 200);
                }
            }

            /**
             * 🔐 CHAT EM GRUPO
             */
            if ($request->type === 'group' && empty($request->name)) {
                return response()->json([
                    'message' => 'Chat em grupo precisa de um nome'
                ], 422);
            }

            /**
             * ✅ Criação do chat
             */
            $chat = Chat::create([
                'type'       => $request->type,
                'name'       => $request->type === 'group' ? $request->name : null,
                'created_by' => $authUser->id,
            ]);

            /**
             * 🔒 Monta pivot com papéis
             */
            $pivotData = [];

            foreach ($participants as $userId) {
                $pivotData[$userId] = [
                    'role' => (
                        $request->type === 'group' && $userId === $authUser->id
                    ) ? 'admin' : 'member'
                ];
            }

            $chat->participants()->sync($pivotData);

            /**
             * 🔒 Primeira mensagem (opcional)
             */
            if ($request->filled('message')) {
                $chat->messages()->create([
                    'user_id' => $authUser->id,
                    'message' => $request->message,
                ]);
            }

            /**
             * 🔄 Reload seguro
             */
            $chat->load([
                'participants:id,name',
                'lastMessage.user'
            ]);

            return response()->json([
                'chat' => $chat
            ], 201);
        });
    }


    public function participants(Chat $chat)
    {
        return response()->json($chat->load('participants'));
    }
}
