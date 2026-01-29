<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Gilvan Santos',
            'phone' => '11111111111',
            'email' => 'gilvan@email.com',
            'password' => Hash::make('123'),
        ]);

        User::create([
            'name' => 'Miguel Angelo',
            'phone' => '22222222222',
            'email' => 'miguel@email.com',
            'password' => Hash::make('123'),
        ]);

        User::create([
            'name' => 'Bruna Suany',
            'phone' => '33333333333',
            'email' => 'bruna@email.com',
            'password' => Hash::make('123'),
        ]);
    }
}
