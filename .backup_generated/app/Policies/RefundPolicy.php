<?php

namespace App\Policies;

use App\Models\Refund;
use App\Models\User;

class RefundPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function view(User $user, Refund $refund): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }
}
