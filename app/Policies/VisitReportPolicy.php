<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VisitReport;

class VisitReportPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('visits.view')
            || $user->hasPermission('visits.manage.assigned')
            || $user->hasPermission('visits.view.family');
    }

    public function view(User $user, VisitReport $visitReport): bool
    {
        if ($user->hasPermission('visits.view')) {
            return true;
        }

        if ($user->hasPermission('visits.manage.assigned') && $user->caregiver?->id === $visitReport->caregiver_id) {
            return true;
        }

        return $user->hasPermission('visits.view.family')
            && $visitReport->booking?->client_id === $user->familyMember?->client_id
            && $user->familyMember?->can_view_reports;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('visits.manage.assigned');
    }

    public function update(User $user, VisitReport $visitReport): bool
    {
        return $user->hasPermission('visits.view')
            || ($user->hasPermission('visits.manage.assigned') && $user->caregiver?->id === $visitReport->caregiver_id);
    }

    public function submit(User $user, VisitReport $visitReport): bool
    {
        return $user->hasPermission('visits.manage.assigned')
            && $user->caregiver?->id === $visitReport->caregiver_id;
    }

    public function review(User $user, VisitReport $visitReport): bool
    {
        return $user->hasPermission('visits.review');
    }
}
