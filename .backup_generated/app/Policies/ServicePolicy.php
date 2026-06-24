<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    public function viewAny(?User $user = null): bool
    {
        return true;
    }

    public function view(?User $user, Service $service): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function update(User $user, Service $service): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function delete(User $user, Service $service): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }
}
