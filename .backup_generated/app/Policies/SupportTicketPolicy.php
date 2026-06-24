<?php

namespace App\Policies;

use App\Models\SupportTicket;
use App\Models\User;

class SupportTicketPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, SupportTicket $supportTicket): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || $supportTicket->user_id === $user->id
            || $supportTicket->assigned_to === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, SupportTicket $supportTicket): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || $supportTicket->user_id === $user->id
            || $supportTicket->assigned_to === $user->id;
    }
}
