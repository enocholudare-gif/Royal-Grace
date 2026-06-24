<?php

namespace App\Policies;

use App\Models\Caregiver;
use App\Models\User;

class CaregiverPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function view(User $user, Caregiver $caregiver): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || ($user->role?->slug === 'caregiver' && $user->caregiver?->id === $caregiver->id);
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function update(User $user, Caregiver $caregiver): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || ($user->role?->slug === 'caregiver' && $user->caregiver?->id === $caregiver->id);
    }

    public function delete(User $user, Caregiver $caregiver): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }
}
