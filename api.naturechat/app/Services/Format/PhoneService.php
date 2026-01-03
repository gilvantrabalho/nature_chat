<?php

namespace App\Services\Format;

class PhoneService
{
    public function unformatPhone(string $phone): string
    {
        return preg_replace('/\D/', '', $phone);
    }
}
