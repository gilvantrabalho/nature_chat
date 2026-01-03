<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Se quiser validar se o usuário pertence ao chat,
        // isso deve ser feito no controller ou em Policy.
        return true;
    }

    public function rules(): array
    {
        return [
            'chat_id' => ['required', 'integer', 'exists:chats,id'],
            'message' => ['required', 'string', 'max:5000'],
            'type' => ['required', 'string', 'in:text,image,file'],
        ];
    }

    public function messages(): array
    {
        return [
            'chat_id.required' => 'O chat é obrigatório.',
            'chat_id.exists' => 'O chat informado não existe.',

            'message.required' => 'A mensagem não pode estar vazia.',
            'message.max' => 'A mensagem excede o tamanho permitido.',

            'type.required' => 'O tipo da mensagem é obrigatório.',
            'type.in' => 'Tipo de mensagem inválido.',
        ];
    }
}
