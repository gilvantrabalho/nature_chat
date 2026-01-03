<?php

namespace App\Http\Controllers\Phone;

use App\Http\Controllers\Controller;
use App\Repositories\PhoneRepository;
use Illuminate\Http\Request;

class PhoneController extends Controller
{
    public function __construct(
        private PhoneRepository $phoneRepository
    ) {}

    /*
        Verifica se o número de telefone, pertence a alguma usuário
    */
    public function verify(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
        ]);

        $exists = $this->phoneRepository
            ->verifyPhoneBelongsToUser($validated['phone']);

        return response()->json($exists);
    }
}
