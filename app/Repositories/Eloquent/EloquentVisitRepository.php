<?php

namespace App\Repositories\Eloquent;

use App\Models\Booking;
use App\Models\User;
use App\Models\VisitReport;
use App\Repositories\Contracts\VisitRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentVisitRepository implements VisitRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return VisitReport::query()
            ->with(['booking.client.user', 'caregiver.user', 'reviewer'])
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['booking_id'] ?? null, fn ($query, int $bookingId) => $query->where('booking_id', $bookingId))
            ->when($filters['caregiver_id'] ?? null, fn ($query, int $caregiverId) => $query->where('caregiver_id', $caregiverId))
            ->when($filters['from'] ?? null, fn ($query, string $from) => $query->where('arrival_time', '>=', $from))
            ->when($filters['to'] ?? null, fn ($query, string $to) => $query->where('arrival_time', '<=', $to))
            ->when($filters['viewer'] ?? null, function ($query, User $viewer): void {
                if ($viewer->hasPermission('visits.view')) {
                    return;
                }

                if ($viewer->hasPermission('visits.manage.assigned')) {
                    $query->where('caregiver_id', $viewer->caregiver?->id ?: 0);
                }

                if ($viewer->hasPermission('visits.view.family')) {
                    $query->whereHas('booking', fn ($query) => $query->where('client_id', $viewer->familyMember?->client_id ?: 0));
                }
            })
            ->latest()
            ->paginate($perPage);
    }

    public function findForBooking(Booking $booking): ?VisitReport
    {
        return VisitReport::query()->where('booking_id', $booking->id)->first();
    }

    public function create(array $data): VisitReport
    {
        return VisitReport::query()->create($data)->fresh(['booking', 'caregiver.user']);
    }

    public function update(VisitReport $visitReport, array $data): VisitReport
    {
        $visitReport->update($data);

        return $visitReport->fresh(['booking', 'caregiver.user', 'reviewer']);
    }
}
