<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('messages.view');
    }

    public function view(User $user, Conversation $conversation): bool
    {
        if ($user->hasPermission('messages.manage')) {
            return true;
        }

        return $conversation->participants()->where('users.id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('messages.create')
            || $user->hasPermission('messages.manage');
    }

    public function createInConversation(User $user, Conversation $conversation): bool
    {
        return ($user->hasPermission('messages.create') || $user->hasPermission('messages.manage'))
            && $conversation->participants()->where('users.id', $user->id)->exists();
    }
}
