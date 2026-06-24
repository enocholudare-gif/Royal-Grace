<?php

namespace App\Services\Auth;

use App\Models\Caregiver;
use App\Models\Client;
use App\Models\FamilyMember;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class RegisterUserService
{
    public function handle(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $role = Role::query()->where('slug', $data['role'])->first();

            if (! $role) {
                throw ValidationException::withMessages([
                    'role' => ['The selected role is invalid.'],
                ]);
            }

            $user = User::query()->create([
                'role_id' => $role->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make($data['password']),
                'status' => 'pending_verification',
            ]);

            $this->createProfileForRole($user, $data);

            event(new Registered($user));

            $token = $user->createToken($data['device_name'] ?? 'web')->plainTextToken;

            return [
                'user' => $user->fresh(['role', 'client', 'familyMember', 'caregiver']),
                'token' => $token,
            ];
        });
    }

    protected function createProfileForRole(User $user, array $data): void
    {
        match ($data['role']) {
            'client' => $this->createClientProfile($user, $data['client'] ?? []),
            'family-member' => $this->createFamilyMemberProfile($user, $data['family_member'] ?? []),
            'caregiver' => $this->createCaregiverProfile($user, $data['caregiver'] ?? []),
            default => null,
        };
    }

    protected function createClientProfile(User $user, array $profile): void
    {
        Client::query()->create([
            'user_id' => $user->id,
            'date_of_birth' => $profile['date_of_birth'] ?? null,
            'address_line_1' => $profile['address_line_1'],
            'address_line_2' => $profile['address_line_2'] ?? null,
            'city' => $profile['city'],
            'state' => $profile['state'],
            'postal_code' => $profile['postal_code'],
            'country' => $profile['country'],
            'emergency_contact_name' => $profile['emergency_contact_name'] ?? null,
            'emergency_contact_phone' => $profile['emergency_contact_phone'] ?? null,
            'care_notes' => $profile['care_notes'] ?? null,
            'mobility_notes' => $profile['mobility_notes'] ?? null,
            'medical_notes' => $profile['medical_notes'] ?? null,
            'status' => 'active',
        ]);
    }

    protected function createFamilyMemberProfile(User $user, array $profile): void
    {
        FamilyMember::query()->create([
            'user_id' => $user->id,
            'client_id' => $profile['client_id'],
            'relationship_type' => $profile['relationship_type'],
            'can_view_bookings' => $profile['can_view_bookings'] ?? true,
            'can_view_reports' => $profile['can_view_reports'] ?? false,
            'can_view_invoices' => $profile['can_view_invoices'] ?? false,
            'can_receive_notifications' => $profile['can_receive_notifications'] ?? true,
            'status' => 'active',
        ]);
    }

    protected function createCaregiverProfile(User $user, array $profile): void
    {
        Caregiver::query()->create([
            'user_id' => $user->id,
            'address_line_1' => $profile['address_line_1'],
            'address_line_2' => $profile['address_line_2'] ?? null,
            'city' => $profile['city'],
            'state' => $profile['state'],
            'postal_code' => $profile['postal_code'],
            'country' => $profile['country'],
            'certifications' => $profile['certifications'] ?? null,
            'emergency_contact_name' => $profile['emergency_contact_name'],
            'emergency_contact_phone' => $profile['emergency_contact_phone'],
            'bio' => $profile['bio'] ?? null,
            'average_rating' => 0,
            'attendance_score' => 100,
            'is_available' => true,
            'status' => 'active',
        ]);
    }
}
