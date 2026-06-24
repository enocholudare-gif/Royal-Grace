<?php

namespace App\Repositories\Contracts;

use App\Models\FamilyMember;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface FamilyPortalRepositoryInterface
{
    public function upcomingBookings(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator;

    public function completedVisits(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator;

    public function invoices(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator;

    public function notifications(FamilyMember $familyMember, int $perPage = 15): LengthAwarePaginator;
}
