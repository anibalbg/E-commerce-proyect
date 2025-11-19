<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name'     => 'Administrador',
                'password' => bcrypt('12345678'),
                'is_admin' => true,
            ]
        );

        // Asegurar que si el admin ya existía, no pierda permisos
        if (!$admin->is_admin) {
            $admin->is_admin = true;
            $admin->save();
        }
    }
}
