<?php

namespace App\Policies;

use App\Models\AuditLog;
use App\Models\User;

class AuditLogPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function view(User $user, AuditLog $auditLog): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }
}
