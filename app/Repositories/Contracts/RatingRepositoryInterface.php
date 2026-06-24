<?php

namespace App\Repositories\Contracts;

use App\Models\Booking;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RatingRepositoryInterface
{
    public function paginateForViewer(User $viewer, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findForBooking(Booking $booking, int $clientId): ?Rating;

    public function create(array $data): Rating;
}
