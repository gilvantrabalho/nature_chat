<?php

namespace App\Http\Requests;

use App\Services\Format\PhoneService;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalizações antes da validação
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            // normaliza telefone (remove máscara)
            'telephone' => $this->telephone
                ? (new PhoneService())->unformatPhone($this->telephone)
                : null,

            // mapeia confirm_password -> password_confirmation
            'password_confirmation' => $this->confirm_password ?? null,
        ]);
    }

    /**
     * Regras de validação
     */
    public function rules(): array
    {
        return [
            'name'                  => 'required|string|max:255',
            'email'                 => 'nullable|email|max:255|unique:users,email',
            'telephone'             => 'required|string|unique:users,phone',
            'password'              => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string|min:6',
        ];
    }

    /**
     * Mensagens customizadas
     */
    public function messages(): array
    {
        return [
            'name.required'                  => 'Nome é obrigatório',
            'name.string'                    => 'Nome inválido',
            'name.max'                       => 'Nome muito longo',

            'email.email'                    => 'E-mail inválido',
            'email.unique'                   => 'Este e-mail já está em uso',

            'telephone.required'             => 'Telefone é obrigatório',
            'telephone.unique'               => 'Este telefone já está em uso',

            'password.required'              => 'Senha é obrigatória',
            'password.min'                   => 'A senha deve ter no mínimo 6 caracteres',
            'password.confirmed'             => 'As senhas não conferem',

            'password_confirmation.required' => 'Confirmação de senha é obrigatória',
        ];
    }
}
