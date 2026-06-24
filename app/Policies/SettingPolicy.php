<?php

namespace App\Policies;

use App\Models\Setting;
use App\Models\User;

class SettingPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function view(User $user, Setting $setting): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function update(User $user, Setting $setting): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function delete(User $user, Setting $setting): bool
    {
        return $user->role?->slug === 'super-admin';
    }
}
