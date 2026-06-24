<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin', 'client', 'family-member'], true);
    }

    public function view(User $user, Invoice $invoice): bool
    {
        if (in_array($user->role?->slug, ['super-admin', 'admin'], true)) {
            return true;
        }

        if ($user->role?->slug === 'client' && $invoice->booking?->client?->user_id === $user->id) {
            return true;
        }

        return $user->role?->slug === 'family-member'
            && $invoice->booking?->client_id === $user->familyMember?->client_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }
}
