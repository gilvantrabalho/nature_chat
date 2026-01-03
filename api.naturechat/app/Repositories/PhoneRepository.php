<?php

namespace App\Repositories;

use App\Enums\UserEnum;
use App\Models\User;
use App\Services\Format\PhoneService;

class PhoneRepository
{
    public function __construct(
        private PhoneService $phoneService
    ) {}

    public function verifyPhoneBelongsToUser(string $phone): array
    {
        $phone = $this->phoneService->unformatPhone($phone);

        $user = User::where('phone', $phone)
            ->where('status', UserEnum::ATIVO);

        return [
            // 'exist' => $user->exists(),
            'user' => $user->first()
        ];
    }
}
