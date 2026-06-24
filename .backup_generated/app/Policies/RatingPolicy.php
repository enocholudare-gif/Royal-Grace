<?php

namespace App\Policies;

use App\Models\Rating;
use App\Models\User;

class RatingPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Rating $rating): bool
    {
        if (in_array($user->role?->slug, ['super-admin', 'admin'], true)) {
            return true;
        }

        if ($user->role?->slug === 'client' && $user->client?->id === $rating->client_id) {
            return true;
        }

        return $user->role?->slug === 'caregiver' && $user->caregiver?->id === $rating->caregiver_id;
    }

    public function create(User $user): bool
    {
        return $user->role?->slug === 'client';
    }
}
