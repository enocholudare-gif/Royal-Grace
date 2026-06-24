<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

class RolePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function view(User $user, Role $role): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function create(User $user): bool
    {
        return $user->role?->slug === 'super-admin';
    }

    public function update(User $user, Role $role): bool
    {
        return $user->role?->slug === 'super-admin';
    }

    public function delete(User $user, Role $role): bool
    {
        return $user->role?->slug === 'super-admin' && ! $role->is_system;
    }
}
