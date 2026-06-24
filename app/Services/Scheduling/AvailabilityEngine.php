<?php

namespace App\Services\Scheduling;

use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\CaregiverAvailability;
use App\Models\Client;
use Carbon\CarbonInterface;

class AvailabilityEngine
{
    public function clientHasOverlap(Client $client, CarbonInterface $startsAt, CarbonInterface $endsAt, ?int $ignoreBookingId = null): bool
    {
        return Booking::query()
            ->where('client_id', $client->id)
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->when($ignoreBookingId, fn ($query, int $id) => $query->whereKeyNot($id))
            ->where('scheduled_start_at', '<', $endsAt)
            ->where('scheduled_end_at', '>', $startsAt)
            ->exists();
    }

    public function caregiverHasBookingOverlap(Caregiver $caregiver, CarbonInterface $startsAt, CarbonInterface $endsAt, ?int $ignoreBookingId = null): bool
    {
        return Booking::query()
            ->where('assigned_caregiver_id', $caregiver->id)
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->when($ignoreBookingId, fn ($query, int $id) => $query->whereKeyNot($id))
            ->where('scheduled_start_at', '<', $endsAt)
            ->where('scheduled_end_at', '>', $startsAt)
            ->exists();
    }

    public function caregiverHasUnavailableOverlap(Caregiver $caregiver, CarbonInterface $startsAt, CarbonInterface $endsAt): bool
    {
        return CaregiverAvailability::query()
            ->where('caregiver_id', $caregiver->id)
            ->whereIn('availability_type', ['unavailable', 'leave'])
            ->where('start_datetime', '<', $endsAt)
            ->where('end_datetime', '>', $startsAt)
            ->exists();
    }

    public function caregiverHasExplicitAvailability(Caregiver $caregiver, CarbonInterface $startsAt, CarbonInterface $endsAt): bool
    {
        return CaregiverAvailability::query()
            ->where('caregiver_id', $caregiver->id)
            ->where('availability_type', 'available')
            ->where('start_datetime', '<=', $startsAt)
            ->where('end_datetime', '>=', $endsAt)
            ->exists();
    }

    public function caregiverCanAcceptBooking(Caregiver $caregiver, CarbonInterface $startsAt, CarbonInterface $endsAt, ?int $ignoreBookingId = null): bool
    {
        if (! $caregiver->is_available || $caregiver->status !== 'active') {
            return false;
        }

        if ($this->caregiverHasBookingOverlap($caregiver, $startsAt, $endsAt, $ignoreBookingId)) {
            return false;
        }

        return ! $this->caregiverHasUnavailableOverlap($caregiver, $startsAt, $endsAt);
    }

    public function availabilityHasOverlap(Caregiver $caregiver, CarbonInterface $startsAt, CarbonInterface $endsAt): bool
    {
        return CaregiverAvailability::query()
            ->where('caregiver_id', $caregiver->id)
            ->where('start_datetime', '<', $endsAt)
            ->where('end_datetime', '>', $startsAt)
            ->exists();
    }
}
