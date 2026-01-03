<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => [
                'required',
                Rule::in(['private', 'group']),
            ],

            'user_phones' => [
                'required',
                'array',
                'min:1',
            ],

            'user_phones.*.id' => [
                'required',
                'integer',
                'exists:users,id',
                'distinct',
            ],

            'user_phones.*.phone' => [
                'required',
                'string',
                'min:8',
                'max:20',
            ],

            'message' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ];
    }

    /**
     * IDs dos participantes (SEM auth aqui)
     */
    public function participantIds(): array
    {
        return collect($this->user_phones)
            ->pluck('id')
            ->unique()
            ->values()
            ->toArray();
    }
}
