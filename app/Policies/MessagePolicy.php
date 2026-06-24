<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    public function view(User $user, Message $message): bool
    {
        return (new ConversationPolicy())->view($user, $message->conversation);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('messages.create')
            || $user->hasPermission('messages.manage');
    }

    public function update(User $user, Message $message): bool
    {
        return $message->sender_user_id === $user->id || $user->hasPermission('messages.manage');
    }

    public function delete(User $user, Message $message): bool
    {
        return $message->sender_user_id === $user->id || $user->hasPermission('messages.manage');
    }
}
