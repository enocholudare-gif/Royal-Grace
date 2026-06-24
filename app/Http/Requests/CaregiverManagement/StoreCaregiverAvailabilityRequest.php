<?php

namespace App\Http\Requests\CaregiverManagement;

use App\Services\Scheduling\AvailabilityEngine;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCaregiverAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manageAvailability', $this->route('caregiver')) ?? false;
    }

    public function rules(): array
    {
        return [
            'availability_type' => ['required', Rule::in(['available', 'unavailable', 'leave'])],
            'start_datetime' => ['required', 'date'],
            'end_datetime' => [
                'required',
                'date',
                'after:start_datetime',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $caregiver = $this->route('caregiver');

                    if (! $caregiver || ! $this->input('start_datetime') || ! $value) {
                        return;
                    }

                    $startsAt = CarbonImmutable::parse($this->input('start_datetime'));
                    $endsAt = CarbonImmutable::parse($value);

                    if (app(AvailabilityEngine::class)->availabilityHasOverlap($caregiver, $startsAt, $endsAt)) {
                        $fail('Caregiver already has an availability record overlapping this period.');
                    }
                },
            ],
            'is_recurring' => ['nullable', 'boolean'],
            'recurrence_rule' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
