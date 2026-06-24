<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Conversation $conversation): bool
    {
        if (in_array($user->role?->slug, ['super-admin', 'admin'], true)) {
            return true;
        }

        if ($conversation->created_by === $user->id) {
            return true;
        }

        if ($user->role?->slug === 'client' && $conversation->booking?->client?->user_id === $user->id) {
            return true;
        }

        if ($user->role?->slug === 'caregiver' && $conversation->booking?->assigned_caregiver_id === $user->caregiver?->id) {
            return true;
        }

        return $user->role?->slug === 'family-member'
            && $conversation->booking?->client_id === $user->familyMember?->client_id;
    }

    public function create(User $user): bool
    {
        return true;
    }
}
