<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ClientPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['admin', 'super-admin', 'caregiver', 'family']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Client $client): bool
    {
        if ($user->hasRole(['admin', 'super-admin'])) {
            return true;
        }

        // Family members can view their associated client
        if ($user->hasRole('family')) {
            return $client->familyMembers()->where('user_id', $user->id)->exists();
        }

        // Caregivers can view clients they are assigned to
        if ($user->hasRole('caregiver')) {
            return $client->bookings()->whereHas('assignedCaregiver', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->exists();
        }

        // A client can view themselves
        return $user->id === $client->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['admin', 'super-admin']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Client $client): bool
    {
        if ($user->hasRole(['admin', 'super-admin'])) {
            return true;
        }

        // Clients can update their own profile
        return $user->id === $client->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Client $client): bool
    {
        return $user->hasRole(['admin', 'super-admin']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Client $client = null): bool
    {
        return $user->hasRole(['admin', 'super-admin']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Client $client): bool
    {
        return $user->hasRole(['admin', 'super-admin']);
    }
}
