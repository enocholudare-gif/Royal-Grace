<?php

namespace App\Services\Ratings;

use App\Events\Ratings\LowRatingSubmitted;
use App\Models\Booking;
use App\Models\Rating;
use App\Models\User;
use App\Repositories\Contracts\RatingRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RatingService
{
    public function __construct(
        protected RatingRepositoryInterface $ratings
    ) {
    }

    public function history(User $viewer, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->ratings->paginateForViewer($viewer, $filters, $perPage);
    }

    public function statistics(User $viewer): array
    {
        return $this->ratings->getStatistics($viewer);
    }

    public function submit(User $clientUser, Booking $booking, array $data): Rating
    {
        return DB::transaction(function () use ($clientUser, $booking, $data): Rating {
            $client = $clientUser->client;

            if (! $client && $clientUser->hasRole('family-member')) {
                // Check if family member is linked to the booking's client
                $isLinked = $clientUser->familyMember()->where('client_id', $booking->client_id)->exists();
                if ($isLinked) {
                    $client = $booking->client;
                }
            }

            if (! $client || $booking->client_id !== $client->id) {
                throw ValidationException::withMessages([
                    'booking_id' => ['Client cannot rate this booking.'],
                ]);
            }

            if (! in_array($booking->status, ['completed', 'refunded'], true)) {
                throw ValidationException::withMessages([
                    'booking_id' => ['Only completed visits can be rated.'],
                ]);
            }

            if (! $booking->assigned_caregiver_id) {
                throw ValidationException::withMessages([
                    'booking_id' => ['Booking has no assigned caregiver to rate.'],
                ]);
            }

            if ($this->ratings->findForBooking($booking, $client->id)) {
                throw ValidationException::withMessages([
                    'booking_id' => ['A rating for this booking already exists.'],
                ]);
            }

            $rating = $this->ratings->create([
                'booking_id' => $booking->id,
                'client_id' => $client->id,
                'caregiver_id' => $booking->assigned_caregiver_id,
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
                'submitted_at' => now(),
            ]);

            if ($rating->rating < 3) {
                LowRatingSubmitted::dispatch($rating);
            }

            return $rating;
        });
    }
}
