<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        collect(config('rbac.roles'))->each(function (array $role, string $slug): void {
            Role::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $role['name'],
                    'description' => $role['description'],
                    'is_system' => true,
                ]
            );
        });
    }
}
