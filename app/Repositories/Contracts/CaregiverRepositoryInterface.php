<?php

namespace App\Repositories\Contracts;

use App\Models\Caregiver;
use App\Models\CaregiverAttendance;
use App\Models\CaregiverAvailability;
use App\Models\CaregiverDocument;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CaregiverRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function create(array $data): Caregiver;

    public function update(Caregiver $caregiver, array $data): Caregiver;

    public function attachServices(Caregiver $caregiver, array $serviceIds, ?int $primaryServiceId = null): Caregiver;

    public function createDocument(Caregiver $caregiver, array $data): CaregiverDocument;

    public function createAttendance(Caregiver $caregiver, array $data): CaregiverAttendance;

    public function createAvailability(Caregiver $caregiver, array $data): CaregiverAvailability;
}
