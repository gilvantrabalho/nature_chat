<?php

namespace App\Models\Chat;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'created_by',
    ];

    public function participants()
    {
        return $this->belongsToMany(
            User::class,
            'chat_participants',
            'chat_id',
            'user_id',
        )
            ->withPivot([
                'role',
                'joined_at',
            ])
            ->withTimestamps();
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'chat_participants')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'chat_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function lastMessage()
    {
        return $this->hasOne(ChatMessage::class)->latestOfMany();
    }
}
