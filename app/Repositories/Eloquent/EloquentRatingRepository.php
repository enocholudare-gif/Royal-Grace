<?php

namespace App\Repositories\Eloquent;

use App\Models\Booking;
use App\Models\Rating;
use App\Models\User;
use App\Repositories\Contracts\RatingRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentRatingRepository implements RatingRepositoryInterface
{
    public function paginateForViewer(User $viewer, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Rating::query()
            ->with(['booking.service', 'client.user', 'caregiver.user'])
            ->when($filters['rating'] ?? null, fn ($query, int $rating) => $query->where('rating', $rating))
            ->when($filters['caregiver_id'] ?? null, fn ($query, int $caregiverId) => $query->where('caregiver_id', $caregiverId))
            ->when($filters['booking_id'] ?? null, fn ($query, int $bookingId) => $query->where('booking_id', $bookingId));

        if ($viewer->hasPermission('ratings.view')) {
            return $query->latest('submitted_at')->paginate($perPage);
        }

        if ($viewer->hasPermission('ratings.view.own')) {
            $query->where('client_id', $viewer->client?->id ?: 0);
        } elseif ($viewer->role?->slug === 'caregiver') {
            $query->where('caregiver_id', $viewer->caregiver?->id ?: 0);
        } else {
            $query->whereRaw('1 = 0');
        }

        return $query->latest('submitted_at')->paginate($perPage);
    }

    public function findForBooking(Booking $booking, int $clientId): ?Rating
    {
        return Rating::query()
            ->where('booking_id', $booking->id)
            ->where('client_id', $clientId)
            ->first();
    }

    public function create(array $data): Rating
    {
        return Rating::query()->create($data)->fresh(['booking', 'client.user', 'caregiver.user']);
    }
}
