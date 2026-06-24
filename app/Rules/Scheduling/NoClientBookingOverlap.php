<?php

namespace App\Rules\Scheduling;

use App\Models\Client;
use App\Models\Service;
use App\Services\Scheduling\AvailabilityEngine;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NoClientBookingOverlap implements ValidationRule
{
    public function __construct(
        protected ?Client $client,
        protected ?Service $service,
        protected ?int $ignoreBookingId = null
    ) {
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $this->client || ! $this->service || ! $value) {
            return;
        }

        $startsAt = CarbonImmutable::parse($value);
        $endsAt = $startsAt->addMinutes($this->service->duration_minutes);

        if (app(AvailabilityEngine::class)->clientHasOverlap($this->client, $startsAt, $endsAt, $this->ignoreBookingId)) {
            $fail('Client already has a booking during this time.');
        }
    }
}
