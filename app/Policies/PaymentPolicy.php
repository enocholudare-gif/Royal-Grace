<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('payments.view')
            || $user->hasPermission('payments.view.own');
    }

    public function view(User $user, Payment $payment): bool
    {
        if ($user->hasPermission('payments.view')) {
            return true;
        }

        if ($user->hasPermission('payments.view.own') && $payment->user_id === $user->id) {
            return true;
        }

        return $user->hasPermission('invoices.view.family')
            && $payment->booking?->client_id === $user->familyMember?->client_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('payments.create')
            || $user->hasPermission('payments.manage');
    }

    public function update(User $user, Payment $payment): bool
    {
        return $user->hasPermission('payments.manage');
    }
}
