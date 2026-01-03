<?php

namespace App\Models\Chat;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'user_id',
        'message',
        'type',
    ];

    protected $appends = [
        'is_mine',
        'sender',
    ];

    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getIsMineAttribute(): bool
    {
        $authUser = Auth::guard('api')->user();

        return $authUser
            ? $this->user_id === $authUser->id
            : false;
    }

    public function getSenderAttribute(): ?array
    {
        if (!$this->relationLoaded('user') || !$this->user) {
            return null;
        }

        return [
            'id'   => $this->user->id,
            'name' => $this->user->name,
        ];
    }
}
