<?php

namespace App\Services\Scheduling;

use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\CaregiverAvailability;
use App\Models\Client;
use Carbon\CarbonInterface;
use DomainException;

class SchedulingService
{
    public function __construct(
        protected AvailabilityEngine $availability
    ) {
    }

    public function assertClientCanBook(Client $client, CarbonInterface $startsAt, CarbonInterface $endsAt, ?int $ignoreBookingId = null): void
    {
        if ($this->availability->clientHasOverlap($client, $startsAt, $endsAt, $ignoreBookingId)) {
            throw new DomainException('Client already has a booking during this time.');
        }
    }

    public function assertCaregiverCanBeAssigned(Caregiver $caregiver, Booking $booking): void
    {
        if (! $this->availability->caregiverCanAcceptBooking($caregiver, $booking->scheduled_start_at, $booking->scheduled_end_at, $booking->id)) {
            throw new DomainException('Caregiver is unavailable or already assigned during this time.');
        }
    }

    public function assertAvailabilityCanBeCreated(Caregiver $caregiver, CarbonInterface $startsAt, CarbonInterface $endsAt): void
    {
        if ($this->availability->availabilityHasOverlap($caregiver, $startsAt, $endsAt)) {
            throw new DomainException('Caregiver already has an availability record overlapping this period.');
        }
    }

    public function blockAssignedBookingWindow(Booking $booking): CaregiverAvailability
    {
        return CaregiverAvailability::query()->updateOrCreate(
            [
                'caregiver_id' => $booking->assigned_caregiver_id,
                'start_datetime' => $booking->scheduled_start_at,
                'end_datetime' => $booking->scheduled_end_at,
                'availability_type' => 'unavailable',
            ],
            [
                'is_recurring' => false,
                'recurrence_rule' => null,
                'notes' => "Auto blocked for booking {$booking->booking_number}.",
            ]
        );
    }
}
