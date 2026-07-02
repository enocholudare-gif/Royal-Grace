<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Services\Auth\RegisterUserService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(RegisterUserService $service): void
    {
        // 1. Create Super Admin
        $superAdminRole = Role::where('slug', 'super-admin')->first();
        if ($superAdminRole) {
            User::firstOrCreate(
                ['email' => 'super@example.com'],
                [
                    'role_id' => $superAdminRole->id,
                    'first_name' => 'Super',
                    'last_name' => 'Admin',
                    'password' => Hash::make('superpassword'),
                    'status' => 'active',
                ]
            );
        }

        // 1.5 Create Regular Admin
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole) {
            User::firstOrCreate(
                ['email' => 'admin@example.com'],
                [
                    'role_id' => $adminRole->id,
                    'first_name' => 'Regular',
                    'last_name' => 'Admin',
                    'password' => Hash::make('adminpassword'),
                    'status' => 'active',
                ]
            );
        }

        // 2. Create Client
        if (!User::where('email', 'client@example.com')->exists()) {
            $clientResult = $service->handle([
                'role' => 'client',
                'first_name' => 'Client',
                'last_name' => 'User',
                'email' => 'client@example.com',
                'password' => 'password',
                'client' => [
                    'address_line_1' => '123 Client St',
                    'city' => 'Metropolis',
                    'state' => 'NY',
                    'postal_code' => '10001',
                    'country' => 'USA',
                ]
            ]);
            $clientUser = $clientResult['user'];
            $clientUser->update(['status' => 'active']);
        }

        // 3. Create Caregiver
        if (!User::where('email', 'caregiver@example.com')->exists()) {
            $caregiverResult = $service->handle([
                'role' => 'caregiver',
                'first_name' => 'Caregiver',
                'last_name' => 'User',
                'email' => 'caregiver@example.com',
                'password' => 'password',
                'caregiver' => [
                    'address_line_1' => '456 Caregiver Ave',
                    'city' => 'Metropolis',
                    'state' => 'NY',
                    'postal_code' => '10001',
                    'country' => 'USA',
                    'emergency_contact_name' => 'Jane Doe',
                    'emergency_contact_phone' => '555-1234',
                ]
            ]);
            $caregiverResult['user']->update(['status' => 'active']);
        }

        // 4. Create Family Member
        if (!User::where('email', 'family@example.com')->exists()) {
            // Need a client ID for family member
            $clientId = \App\Models\Client::first()->id ?? 1;

            $familyResult = $service->handle([
                'role' => 'family-member',
                'first_name' => 'Family',
                'last_name' => 'Member',
                'email' => 'family@example.com',
                'password' => 'password',
                'family_member' => [
                    'client_id' => $clientId,
                    'relationship_type' => 'child',
                ]
            ]);
            $familyResult['user']->update(['status' => 'active']);
        }
    }
}
