<?php

namespace App\Services\VisitManagement;

use App\Events\VisitManagement\CaregiverCheckedIn;
use App\Events\VisitManagement\CaregiverCheckedOut;
use App\Events\VisitManagement\VisitReportSubmitted;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\User;
use App\Models\VisitReport;
use App\Notifications\VisitManagement\VisitReportSubmittedNotification;
use App\Repositories\Contracts\VisitRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VisitService
{
    public function __construct(
        protected VisitRepositoryInterface $visits
    ) {
    }

    public function list(User $viewer, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $filters['viewer'] = $viewer;

        return $this->visits->paginate($filters, $perPage);
    }

    public function checkIn(User $caregiverUser, Booking $booking, array $data, Request $request): VisitReport
    {
        return DB::transaction(function () use ($caregiverUser, $booking, $data, $request): VisitReport {
            $caregiver = $caregiverUser->caregiver;

            if (! $caregiver || $booking->assigned_caregiver_id !== $caregiver->id) {
                throw ValidationException::withMessages([
                    'booking_id' => ['Caregiver is not assigned to this booking.'],
                ]);
            }

            $visitReport = $this->visits->findForBooking($booking);

            if ($visitReport?->arrival_time) {
                throw ValidationException::withMessages([
                    'booking_id' => ['Visit already has a check-in.'],
                ]);
            }

            $payload = [
                'booking_id' => $booking->id,
                'caregiver_id' => $caregiver->id,
                'arrival_time' => now(),
                'check_in_latitude' => $data['latitude'],
                'check_in_longitude' => $data['longitude'],
                'check_in_device_info' => $data['device_info'] ?? $request->userAgent(),
                'status' => 'draft',
            ];

            $visitReport = $visitReport
                ? $this->visits->update($visitReport, $payload)
                : $this->visits->create($payload);

            $booking->update(['status' => 'in_progress']);
            $this->audit($caregiverUser, 'visit.check_in', $visitReport, null, $payload, $request);
            CaregiverCheckedIn::dispatch($visitReport);

            return $visitReport;
        });
    }

    public function checkOut(User $caregiverUser, Booking $booking, array $data, Request $request): VisitReport
    {
        return DB::transaction(function () use ($caregiverUser, $booking, $data, $request): VisitReport {
            $visitReport = $this->visits->findForBooking($booking);

            if (! $visitReport || ! $visitReport->arrival_time) {
                throw ValidationException::withMessages([
                    'booking_id' => ['Visit must be checked in before check-out.'],
                ]);
            }

            if ($visitReport->departure_time) {
                throw ValidationException::withMessages([
                    'booking_id' => ['Visit already has a check-out.'],
                ]);
            }

            if ($caregiverUser->caregiver?->id !== $visitReport->caregiver_id) {
                throw ValidationException::withMessages([
                    'booking_id' => ['Caregiver cannot check out another caregiver visit.'],
                ]);
            }

            $oldValues = $visitReport->toArray();
            $payload = [
                'departure_time' => now(),
                'check_out_latitude' => $data['latitude'],
                'check_out_longitude' => $data['longitude'],
                'check_out_device_info' => $data['device_info'] ?? $request->userAgent(),
            ];

            $visitReport = $this->visits->update($visitReport, $payload);
            $booking->update(['status' => 'completed']);
            $this->audit($caregiverUser, 'visit.check_out', $visitReport, $oldValues, $payload, $request);
            CaregiverCheckedOut::dispatch($visitReport);

            return $visitReport;
        });
    }

    public function submitReport(User $user, VisitReport $visitReport, array $data, Request $request): VisitReport
    {
        return DB::transaction(function () use ($user, $visitReport, $data, $request): VisitReport {
            if (! $visitReport->arrival_time || ! $visitReport->departure_time) {
                throw ValidationException::withMessages([
                    'visit_report_id' => ['Visit must be checked in and checked out before report submission.'],
                ]);
            }

            if ($visitReport->status !== 'draft') {
                throw ValidationException::withMessages([
                    'visit_report_id' => ['Visit report has already been submitted or reviewed.'],
                ]);
            }

            $oldValues = $visitReport->toArray();
            $payload = array_merge($data, [
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            $visitReport = $this->visits->update($visitReport, $payload);
            $this->audit($user, 'visit.report_submitted', $visitReport, $oldValues, $payload, $request);
            VisitReportSubmitted::dispatch($visitReport);

            if ($visitReport->booking?->client?->user) {
                $visitReport->booking->client->user->notify(new VisitReportSubmittedNotification($visitReport));
            }

            return $visitReport;
        });
    }

    public function review(User $reviewer, VisitReport $visitReport, Request $request): VisitReport
    {
        return DB::transaction(function () use ($reviewer, $visitReport, $request): VisitReport {
            $oldValues = $visitReport->toArray();
            $payload = [
                'status' => 'reviewed',
                'reviewed_at' => now(),
                'reviewed_by' => $reviewer->id,
            ];

            $visitReport = $this->visits->update($visitReport, $payload);
            $this->audit($reviewer, 'visit.report_reviewed', $visitReport, $oldValues, $payload, $request);

            return $visitReport;
        });
    }

    protected function audit(User $user, string $action, VisitReport $visitReport, ?array $oldValues, array $newValues, Request $request): void
    {
        AuditLog::query()->create([
            'user_id' => $user->id,
            'action' => $action,
            'entity_type' => VisitReport::class,
            'entity_id' => $visitReport->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'metadata' => [
                'booking_id' => $visitReport->booking_id,
                'caregiver_id' => $visitReport->caregiver_id,
            ],
        ]);
    }
}
