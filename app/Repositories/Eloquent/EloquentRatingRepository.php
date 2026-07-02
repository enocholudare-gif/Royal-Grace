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

        if ($viewer->hasRole('client') || $viewer->hasPermission('ratings.view.own')) {
            $query->where('client_id', $viewer->client?->id ?: 0);
        } elseif ($viewer->hasRole('family-member')) {
            $query->where('client_id', $viewer->familyMember?->client_id ?: 0);
        } elseif ($viewer->hasRole('caregiver')) {
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

    public function getStatistics(User $viewer): array
    {
        $query = Rating::query();

        if ($viewer->hasPermission('ratings.view')) {
            // No where clause needed
        } elseif ($viewer->hasRole('client') || $viewer->hasPermission('ratings.view.own')) {
            $query->where('client_id', $viewer->client?->id ?: 0);
        } elseif ($viewer->hasRole('family-member')) {
            $query->where('client_id', $viewer->familyMember?->client_id ?: 0);
        } elseif ($viewer->hasRole('caregiver')) {
            $query->where('caregiver_id', $viewer->caregiver?->id ?: 0);
        } else {
            $query->whereRaw('1 = 0');
        }

        $total = (clone $query)->count();
        $average = (clone $query)->avg('rating') ?: 0.0;
        
        $distribution = (clone $query)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();
            
        // Ensure all 1-5 keys exist
        $distributionMap = [];
        for ($i = 5; $i >= 1; $i--) {
            $distributionMap[$i] = $distribution[$i] ?? 0;
        }

        return [
            'total_reviews' => $total,
            'average_rating' => round($average, 1),
            'distribution' => $distributionMap,
        ];
    }
}
