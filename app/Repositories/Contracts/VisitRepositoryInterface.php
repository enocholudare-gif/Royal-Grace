<?php

namespace App\Repositories\Contracts;

use App\Models\Booking;
use App\Models\VisitReport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface VisitRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findForBooking(Booking $booking): ?VisitReport;

    public function create(array $data): VisitReport;

    public function update(VisitReport $visitReport, array $data): VisitReport;
}
