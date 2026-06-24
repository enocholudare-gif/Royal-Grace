<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin', 'client', 'family-member', 'caregiver'], true);
    }

    public function view(User $user, Booking $booking): bool
    {
        if (in_array($user->role?->slug, ['super-admin', 'admin'], true)) {
            return true;
        }

        if ($user->role?->slug === 'client' && $user->client?->id === $booking->client_id) {
            return true;
        }

        if ($user->role?->slug === 'family-member' && $user->familyMember?->client_id === $booking->client_id) {
            return true;
        }

        return $user->role?->slug === 'caregiver' && $user->caregiver?->id === $booking->assigned_caregiver_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin', 'client', 'family-member'], true);
    }

    public function update(User $user, Booking $booking): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || ($user->role?->slug === 'client' && $user->client?->id === $booking->client_id);
    }

    public function delete(User $user, Booking $booking): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }
}
