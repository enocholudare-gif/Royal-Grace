<?php

namespace App\Repositories\Eloquent;

use App\Models\Booking;
use App\Models\User;
use App\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EloquentBookingRepository implements BookingRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Booking::query()
            ->with(['client.user', 'service', 'assignedCaregiver.user', 'preferredCaregiver.user'])
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['client_id'] ?? null, fn ($query, int $clientId) => $query->where('client_id', $clientId))
            ->when($filters['service_id'] ?? null, fn ($query, int $serviceId) => $query->where('service_id', $serviceId))
            ->when($filters['assigned_caregiver_id'] ?? null, fn ($query, int $caregiverId) => $query->where('assigned_caregiver_id', $caregiverId))
            ->when($filters['from'] ?? null, fn ($query, string $from) => $query->where('scheduled_start_at', '>=', $from))
            ->when($filters['to'] ?? null, fn ($query, string $to) => $query->where('scheduled_start_at', '<=', $to))
            ->when($filters['recurrence_group_uuid'] ?? null, fn ($query, string $uuid) => $query->where('recurrence_group_uuid', $uuid))
            ->when($filters['viewer'] ?? null, function ($query, User $viewer): void {
                if ($viewer->hasRole('client')) {
                    $query->where('client_id', $viewer->client?->id ?: 0);
                }

                if ($viewer->hasRole('family-member')) {
                    $query->where('client_id', $viewer->familyMember?->client_id ?: 0);
                }

                if ($viewer->hasRole('caregiver')) {
                    $query->where('assigned_caregiver_id', $viewer->caregiver?->id ?: 0);
                }
            })
            ->latest('scheduled_start_at')
            ->paginate($perPage);
    }

    public function create(array $data): Booking
    {
        return Booking::query()->create($data)->fresh(['client.user', 'service']);
    }

    public function update(Booking $booking, array $data): Booking
    {
        $booking->update($data);

        return $booking->fresh(['client.user', 'service', 'assignedCaregiver.user', 'preferredCaregiver.user']);
    }

    public function forRecurrenceGroup(string $recurrenceGroupUuid): Collection
    {
        return Booking::query()
            ->where('recurrence_group_uuid', $recurrenceGroupUuid)
            ->orderBy('scheduled_start_at')
            ->get();
    }
}
