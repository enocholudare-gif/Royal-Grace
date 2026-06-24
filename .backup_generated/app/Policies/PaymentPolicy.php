<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin', 'client', 'family-member'], true);
    }

    public function view(User $user, Payment $payment): bool
    {
        if (in_array($user->role?->slug, ['super-admin', 'admin'], true)) {
            return true;
        }

        if ($payment->user_id === $user->id) {
            return true;
        }

        return $user->role?->slug === 'family-member'
            && $payment->booking?->client_id === $user->familyMember?->client_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin', 'client'], true);
    }

    public function update(User $user, Payment $payment): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }
}
