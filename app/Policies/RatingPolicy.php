<?php

namespace App\Policies;

use App\Models\Rating;
use App\Models\User;

class RatingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('ratings.view')
            || $user->hasPermission('ratings.view.own')
            || $user->role?->slug === 'caregiver';
    }

    public function view(User $user, Rating $rating): bool
    {
        if ($user->hasPermission('ratings.view')) {
            return true;
        }

        if ($user->hasPermission('ratings.view.own') && $user->client?->id === $rating->client_id) {
            return true;
        }

        return $user->role?->slug === 'caregiver' && $user->caregiver?->id === $rating->caregiver_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('ratings.create');
    }
}
