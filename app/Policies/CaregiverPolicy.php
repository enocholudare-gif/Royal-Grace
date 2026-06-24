<?php

namespace App\Policies;

use App\Models\Caregiver;
use App\Models\User;

class CaregiverPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('caregivers.view')
            || $user->hasPermission('profile.view');
    }

    public function view(User $user, Caregiver $caregiver): bool
    {
        return $user->hasPermission('caregivers.view')
            || ($user->hasPermission('profile.view') && $user->caregiver?->id === $caregiver->id);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('caregivers.manage');
    }

    public function update(User $user, Caregiver $caregiver): bool
    {
        return $user->hasPermission('caregivers.manage')
            || ($user->hasPermission('profile.update') && $user->caregiver?->id === $caregiver->id);
    }

    public function delete(User $user, Caregiver $caregiver): bool
    {
        return $user->hasPermission('caregivers.manage');
    }

    public function uploadDocument(User $user, Caregiver $caregiver): bool
    {
        return $user->hasPermission('caregivers.manage')
            || ($user->hasPermission('profile.update') && $user->caregiver?->id === $caregiver->id);
    }

    public function recordAttendance(User $user, Caregiver $caregiver): bool
    {
        return $user->hasPermission('caregivers.manage')
            || ($user->hasPermission('visits.manage.assigned') && $user->caregiver?->id === $caregiver->id);
    }

    public function manageAvailability(User $user, Caregiver $caregiver): bool
    {
        return $user->hasPermission('caregivers.manage')
            || ($user->hasPermission('availability.manage.own') && $user->caregiver?->id === $caregiver->id);
    }
}
