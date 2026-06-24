<?php

namespace App\Policies;

use App\Models\SupportTicket;
use App\Models\User;

class SupportTicketPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('support.manage')
            || $user->hasPermission('support.view.own');
    }

    public function view(User $user, SupportTicket $supportTicket): bool
    {
        return $user->hasPermission('support.manage')
            || $supportTicket->user_id === $user->id
            || $supportTicket->assigned_to === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('support.create')
            || $user->hasPermission('support.manage');
    }

    public function update(User $user, SupportTicket $supportTicket): bool
    {
        return $user->hasPermission('support.manage')
            || $supportTicket->user_id === $user->id
            || $supportTicket->assigned_to === $user->id;
    }
}
