<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function view(User $user, Client $client): bool
    {
        if (in_array($user->role?->slug, ['super-admin', 'admin'], true)) {
            return true;
        }

        if ($user->role?->slug === 'client' && $user->client?->id === $client->id) {
            return true;
        }

        return $user->role?->slug === 'family-member' && $user->familyMember?->client_id === $client->id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function update(User $user, Client $client): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || ($user->role?->slug === 'client' && $user->client?->id === $client->id);
    }

    public function delete(User $user, Client $client): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }
}
