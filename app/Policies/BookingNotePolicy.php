<?php

namespace App\Policies;

use App\Models\BookingNote;
use App\Models\User;

class BookingNotePolicy
{
    public function view(User $user, BookingNote $bookingNote): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin', 'caregiver', 'client', 'family-member'], true);
    }

    public function update(User $user, BookingNote $bookingNote): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || $bookingNote->author_user_id === $user->id;
    }

    public function delete(User $user, BookingNote $bookingNote): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || $bookingNote->author_user_id === $user->id;
    }
}
