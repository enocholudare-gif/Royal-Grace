<?php

namespace App\Repositories\Eloquent;

use App\Models\Caregiver;
use App\Models\CaregiverAttendance;
use App\Models\CaregiverAvailability;
use App\Models\CaregiverDocument;
use App\Repositories\Contracts\CaregiverRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentCaregiverRepository implements CaregiverRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Caregiver::query()
            ->with(['user', 'services'])
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when(array_key_exists('is_available', $filters), fn ($query) => $query->where('is_available', (bool) $filters['is_available']))
            ->when($filters['city'] ?? null, fn ($query, string $city) => $query->where('city', $city))
            ->when($filters['state'] ?? null, fn ($query, string $state) => $query->where('state', $state))
            ->when($filters['service_id'] ?? null, fn ($query, int $serviceId) => $query->whereHas('services', fn ($query) => $query->where('services.id', $serviceId)))
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Caregiver
    {
        return Caregiver::query()->create($data)->fresh(['user', 'services']);
    }

    public function update(Caregiver $caregiver, array $data): Caregiver
    {
        $caregiver->update($data);

        return $caregiver->fresh(['user', 'services']);
    }

    public function attachServices(Caregiver $caregiver, array $serviceIds, ?int $primaryServiceId = null): Caregiver
    {
        $payload = collect($serviceIds)
            ->mapWithKeys(fn (int $serviceId) => [
                $serviceId => ['is_primary' => $primaryServiceId !== null && $serviceId === $primaryServiceId],
            ])
            ->all();

        $caregiver->services()->sync($payload);

        return $caregiver->fresh(['user', 'services']);
    }

    public function createDocument(Caregiver $caregiver, array $data): CaregiverDocument
    {
        return $caregiver->documents()->create($data);
    }

    public function createAttendance(Caregiver $caregiver, array $data): CaregiverAttendance
    {
        return $caregiver->attendanceRecords()->updateOrCreate(
            [
                'booking_id' => $data['booking_id'] ?? null,
                'attendance_date' => $data['attendance_date'],
            ],
            $data
        );
    }

    public function createAvailability(Caregiver $caregiver, array $data): CaregiverAvailability
    {
        return $caregiver->availabilities()->create($data);
    }
}
