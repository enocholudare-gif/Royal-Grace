<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VisitReport;

class VisitReportPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin', 'caregiver', 'family-member'], true);
    }

    public function view(User $user, VisitReport $visitReport): bool
    {
        if (in_array($user->role?->slug, ['super-admin', 'admin'], true)) {
            return true;
        }

        if ($user->role?->slug === 'caregiver' && $user->caregiver?->id === $visitReport->caregiver_id) {
            return true;
        }

        return $user->role?->slug === 'family-member'
            && $visitReport->booking?->client_id === $user->familyMember?->client_id
            && $user->familyMember?->can_view_reports;
    }

    public function create(User $user): bool
    {
        return $user->role?->slug === 'caregiver';
    }

    public function update(User $user, VisitReport $visitReport): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || ($user->role?->slug === 'caregiver' && $user->caregiver?->id === $visitReport->caregiver_id);
    }
}
