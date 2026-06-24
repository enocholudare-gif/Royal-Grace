<?php

namespace App\Services\CaregiverManagement;

use App\Models\Caregiver;
use App\Models\CaregiverAttendance;
use App\Models\CaregiverAvailability;
use App\Models\CaregiverDocument;
use App\Models\Role;
use App\Models\User;
use App\Repositories\Contracts\CaregiverRepositoryInterface;
use App\Services\Scheduling\SchedulingService;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CaregiverManagementService
{
    public function __construct(
        protected CaregiverRepositoryInterface $caregivers,
        protected SchedulingService $scheduling
    ) {
    }

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->caregivers->paginate($filters, $perPage);
    }

    public function create(array $data): Caregiver
    {
        return DB::transaction(function () use ($data): Caregiver {
            $role = Role::query()->where('slug', 'caregiver')->firstOrFail();

            $user = User::query()->create([
                'role_id' => $role->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make($data['password']),
                'status' => $data['user_status'] ?? 'active',
                'email_verified_at' => $data['email_verified_at'] ?? null,
            ]);

            return $this->caregivers->create([
                'user_id' => $user->id,
                'address_line_1' => $data['address_line_1'],
                'address_line_2' => $data['address_line_2'] ?? null,
                'city' => $data['city'],
                'state' => $data['state'],
                'postal_code' => $data['postal_code'],
                'country' => $data['country'],
                'certifications' => $data['certifications'] ?? null,
                'emergency_contact_name' => $data['emergency_contact_name'],
                'emergency_contact_phone' => $data['emergency_contact_phone'],
                'bio' => $data['bio'] ?? null,
                'is_available' => $data['is_available'] ?? true,
                'status' => $data['status'] ?? 'active',
            ]);
        });
    }

    public function update(Caregiver $caregiver, array $data): Caregiver
    {
        return $this->caregivers->update($caregiver, $data);
    }

    public function uploadDocument(Caregiver $caregiver, UploadedFile $file, User $uploader, array $data): CaregiverDocument
    {
        $disk = $data['disk'] ?? config('filesystems.default', 'local');
        $path = $file->store("caregivers/{$caregiver->id}/documents", $disk);

        return $this->caregivers->createDocument($caregiver, [
            'uploaded_by' => $uploader->id,
            'document_type' => $data['document_type'],
            'original_name' => $file->getClientOriginalName(),
            'disk' => $disk,
            'path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'size_bytes' => $file->getSize(),
            'status' => 'pending_review',
            'expires_at' => $data['expires_at'] ?? null,
        ]);
    }

    public function assignServices(Caregiver $caregiver, array $serviceIds, ?int $primaryServiceId = null): Caregiver
    {
        return $this->caregivers->attachServices($caregiver, $serviceIds, $primaryServiceId);
    }

    public function recordAttendance(Caregiver $caregiver, User $recorder, array $data): CaregiverAttendance
    {
        if (($data['clock_in_at'] ?? null) && ($data['clock_out_at'] ?? null)) {
            $clockIn = CarbonImmutable::parse($data['clock_in_at']);
            $clockOut = CarbonImmutable::parse($data['clock_out_at']);
            $data['hours_worked'] = round($clockIn->diffInMinutes($clockOut) / 60, 2);
        }

        $data['recorded_by'] = $recorder->id;

        return $this->caregivers->createAttendance($caregiver, $data);
    }

    public function createAvailability(Caregiver $caregiver, array $data): CaregiverAvailability
    {
        $this->scheduling->assertAvailabilityCanBeCreated(
            $caregiver,
            CarbonImmutable::parse($data['start_datetime']),
            CarbonImmutable::parse($data['end_datetime'])
        );

        return $this->caregivers->createAvailability($caregiver, $data);
    }
}
