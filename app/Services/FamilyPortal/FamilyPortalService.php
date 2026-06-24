<?php

namespace App\Services\FamilyPortal;

use App\Models\FamilyMember;
use App\Repositories\Contracts\FamilyPortalRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class FamilyPortalService
{
    public function __construct(
        protected FamilyPortalRepositoryInterface $portal
    ) {
    }

    public function upcomingBookings(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator
    {
        $this->ensureActive($familyMember);
        $this->ensureFlag($familyMember->can_view_bookings, 'Family member cannot view bookings.');

        return $this->portal->upcomingBookings($familyMember, $perPage);
    }

    public function completedVisits(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator
    {
        $this->ensureActive($familyMember);
        $this->ensureFlag($familyMember->can_view_reports, 'Family member cannot view visit reports.');

        return $this->portal->completedVisits($familyMember, $perPage);
    }

    public function invoices(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator
    {
        $this->ensureActive($familyMember);
        $this->ensureFlag($familyMember->can_view_invoices, 'Family member cannot view invoices.');

        return $this->portal->invoices($familyMember, $perPage);
    }

    public function notifications(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator
    {
        $this->ensureActive($familyMember);
        $this->ensureFlag($familyMember->can_receive_notifications, 'Family member cannot view notifications.');

        return $this->portal->notifications($familyMember, $perPage);
    }

    protected function ensureActive(FamilyMember $familyMember): void
    {
        if ($familyMember->status !== 'active') {
            throw ValidationException::withMessages([
                'family_member' => ['Family member access is inactive.'],
            ]);
        }
    }

    protected function ensureFlag(bool $allowed, string $message): void
    {
        if (! $allowed) {
            throw ValidationException::withMessages([
                'family_member' => [$message],
            ]);
        }
    }
}
