<?php

namespace App\Services\BookingManagement;

use App\Events\BookingManagement\BookingAssigned;
use App\Events\BookingManagement\BookingCancelled;
use App\Events\BookingManagement\BookingConfirmed;
use App\Events\BookingManagement\BookingCreated;
use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\Client;
use App\Models\Service;
use App\Models\User;
use App\Repositories\Contracts\BookingRepositoryInterface;
use App\Services\Scheduling\SchedulingService;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class BookingManagementService
{
    public function __construct(
        protected BookingRepositoryInterface $bookings,
        protected SchedulingService $scheduling
    ) {
    }

    public function list(User $viewer, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $filters['viewer'] = $viewer;

        return $this->bookings->paginate($filters, $perPage);
    }

    public function create(User $creator, array $data): Collection
    {
        return DB::transaction(function () use ($creator, $data): Collection {
            $client = $this->resolveClient($creator, $data);
            $service = Service::query()->where('status', 'active')->findOrFail($data['service_id']);
            $recurrence = $data['recurrence'] ?? null;
            $startsAt = CarbonImmutable::parse($data['scheduled_start_at']);
            $scheduledStarts = $this->scheduledStarts($startsAt, $recurrence);
            $recurrenceGroupUuid = count($scheduledStarts) > 1 ? (string) Str::uuid() : null;
            $createdBookings = new Collection();

            foreach ($scheduledStarts as $scheduledStart) {
                $scheduledEnd = $scheduledStart->addMinutes($service->duration_minutes);
                $this->scheduling->assertClientCanBook($client, $scheduledStart, $scheduledEnd);

                $booking = $this->bookings->create([
                    'booking_number' => $this->generateBookingNumber(),
                    'client_id' => $client->id,
                    'service_id' => $service->id,
                    'preferred_caregiver_id' => $data['preferred_caregiver_id'] ?? null,
                    'scheduled_start_at' => $scheduledStart,
                    'scheduled_end_at' => $scheduledEnd,
                    'care_instructions' => $data['care_instructions'] ?? null,
                    'service_name_snapshot' => $service->name,
                    'service_price_snapshot' => $service->price,
                    'service_duration_snapshot' => $service->duration_minutes,
                    'status' => 'awaiting_payment',
                    'booking_source' => $creator->hasRole('family-member') ? 'family' : ($creator->hasRole(['admin', 'super-admin']) ? 'admin' : 'web'),
                    'is_recurring' => $recurrenceGroupUuid !== null,
                    'recurrence_group_uuid' => $recurrenceGroupUuid,
                    'subtotal_amount' => $service->price,
                    'discount_amount' => $data['discount_amount'] ?? 0,
                    'tax_amount' => $data['tax_amount'] ?? 0,
                    'total_amount' => ((float) $service->price - (float) ($data['discount_amount'] ?? 0)) + (float) ($data['tax_amount'] ?? 0),
                ]);

                $createdBookings->push($booking);
                BookingCreated::dispatch($booking);
            }

            return $createdBookings;
        });
    }

    public function update(Booking $booking, array $data): Booking
    {
        return DB::transaction(function () use ($booking, $data): Booking {
            if (isset($data['service_id'])) {
                $service = Service::query()->where('status', 'active')->findOrFail($data['service_id']);
                $data['service_name_snapshot'] = $service->name;
                $data['service_price_snapshot'] = $service->price;
                $data['service_duration_snapshot'] = $service->duration_minutes;
                $data['subtotal_amount'] = $service->price;
                $data['total_amount'] = ((float) $service->price - (float) ($data['discount_amount'] ?? $booking->discount_amount)) + (float) ($data['tax_amount'] ?? $booking->tax_amount);
            }

            if (isset($data['scheduled_start_at'])) {
                $duration = (int) ($data['service_duration_snapshot'] ?? $booking->service_duration_snapshot);
                $start = CarbonImmutable::parse($data['scheduled_start_at']);
                $data['scheduled_end_at'] = $start->addMinutes($duration);
                $this->scheduling->assertClientCanBook($booking->client, $start, $data['scheduled_end_at'], $booking->id);
            }

            return $this->bookings->update($booking, $data);
        });
    }

    public function assign(Booking $booking, Caregiver $caregiver): Booking
    {
        $this->scheduling->assertCaregiverCanBeAssigned($caregiver, $booking);

        $booking = $this->bookings->update($booking, [
            'assigned_caregiver_id' => $caregiver->id,
            'status' => 'assigned',
        ]);

        $this->scheduling->blockAssignedBookingWindow($booking);

        BookingAssigned::dispatch($booking);

        return $booking;
    }

    public function confirm(Booking $booking): Booking
    {
        $booking = $this->bookings->update($booking, [
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        BookingConfirmed::dispatch($booking);

        return $booking;
    }

    public function markAwaitingPayment(Booking $booking): Booking
    {
        return $this->bookings->update($booking, ['status' => 'awaiting_payment']);
    }

    public function updateStatus(Booking $booking, string $status): Booking
    {
        $payload = ['status' => $status];

        if ($status === 'confirmed') {
            $payload['confirmed_at'] = now();
        }

        return $this->bookings->update($booking, $payload);
    }

    public function cancel(Booking $booking, User $cancelledBy, ?string $reason = null): Booking
    {
        $booking = $this->bookings->update($booking, [
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancelled_by' => $cancelledBy->id,
            'cancellation_reason' => $reason,
        ]);

        BookingCancelled::dispatch($booking);

        return $booking;
    }

    protected function resolveClient(User $creator, array $data): Client
    {
        if ($creator->hasRole(['admin', 'super-admin']) && isset($data['client_id'])) {
            return Client::query()->findOrFail($data['client_id']);
        }

        if ($creator->hasRole('family-member')) {
            return $creator->familyMember?->client ?? throw new InvalidArgumentException('Family member is not linked to a client.');
        }

        return $creator->client ?? throw new InvalidArgumentException('User does not have a client profile.');
    }

    protected function scheduledStarts(CarbonImmutable $startsAt, ?array $recurrence): array
    {
        if (! $recurrence) {
            return [$startsAt];
        }

        $frequency = $recurrence['frequency'] ?? null;
        $interval = (int) ($recurrence['interval'] ?? 1);
        $occurrences = (int) ($recurrence['occurrences'] ?? 1);
        $dates = [];

        for ($count = 0; $count < $occurrences; $count++) {
            $dates[] = match ($frequency) {
                'daily' => $startsAt->addDays($count * $interval),
                'weekly' => $startsAt->addWeeks($count * $interval),
                'monthly' => $startsAt->addMonthsNoOverflow($count * $interval),
                default => throw new InvalidArgumentException('Unsupported recurrence frequency.'),
            };
        }

        return $dates;
    }

    protected function generateBookingNumber(): string
    {
        do {
            $bookingNumber = 'RG-' . now()->format('ymd') . '-' . Str::upper(Str::random(6));
        } while (Booking::query()->where('booking_number', $bookingNumber)->exists());

        return $bookingNumber;
    }
}
