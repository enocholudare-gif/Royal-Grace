<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function view(User $user, User $model): bool
    {
        return $user->id === $model->id || in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function update(User $user, User $model): bool
    {
        return $user->id === $model->id || in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function delete(User $user, User $model): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true) && $user->id !== $model->id;
    }
}
