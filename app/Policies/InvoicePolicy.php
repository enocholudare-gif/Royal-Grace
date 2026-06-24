<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('invoices.view')
            || $user->hasPermission('invoices.view.own')
            || $user->hasPermission('invoices.view.family');
    }

    public function view(User $user, Invoice $invoice): bool
    {
        if ($user->hasPermission('invoices.view')) {
            return true;
        }

        if ($user->hasPermission('invoices.view.own') && $invoice->booking?->client?->user_id === $user->id) {
            return true;
        }

        return $user->hasPermission('invoices.view.family')
            && $invoice->booking?->client_id === $user->familyMember?->client_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('payments.manage');
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->hasPermission('payments.manage');
    }
}
