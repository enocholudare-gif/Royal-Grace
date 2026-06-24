<?php

namespace App\Repositories\Eloquent;

use App\Models\Booking;
use App\Models\FamilyMember;
use App\Models\Invoice;
use App\Models\VisitReport;
use App\Repositories\Contracts\FamilyPortalRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentFamilyPortalRepository implements FamilyPortalRepositoryInterface
{
    public function upcomingBookings(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator
    {
        return Booking::query()
            ->with(['service', 'assignedCaregiver.user'])
            ->where('client_id', $familyMember->client_id)
            ->where('scheduled_start_at', '>=', now())
            ->whereNotIn('status', ['cancelled', 'refunded', 'completed'])
            ->orderBy('scheduled_start_at')
            ->paginate($perPage);
    }

    public function completedVisits(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator
    {
        return VisitReport::query()
            ->with(['booking.service', 'caregiver.user'])
            ->whereHas('booking', fn ($query) => $query->where('client_id', $familyMember->client_id))
            ->whereNotNull('departure_time')
            ->latest('departure_time')
            ->paginate($perPage);
    }

    public function invoices(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator
    {
        return Invoice::query()
            ->with(['booking.service', 'payments'])
            ->whereHas('booking', fn ($query) => $query->where('client_id', $familyMember->client_id))
            ->latest('issue_date')
            ->paginate($perPage);
    }

    public function notifications(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator
    {
        return $familyMember->user->notifications()
            ->latest()
            ->paginate($perPage);
    }
}
