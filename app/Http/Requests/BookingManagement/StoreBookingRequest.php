<?php

namespace App\Http\Requests\BookingManagement;

use App\Models\Client;
use App\Models\Service;
use App\Rules\Scheduling\NoClientBookingOverlap;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\Booking::class) ?? false;
    }

    public function rules(): array
    {
        $client = $this->resolvedClient();
        $service = $this->input('service_id') ? Service::query()->find($this->input('service_id')) : null;

        return [
            'client_id' => [
                Rule::requiredIf(fn () => $this->user()?->hasRole(['admin', 'super-admin'])),
                'integer',
                'exists:clients,id',
            ],
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'preferred_caregiver_id' => ['nullable', 'integer', 'exists:caregivers,id'],
            'scheduled_start_at' => ['required', 'date', 'after:now', new NoClientBookingOverlap($client, $service)],
            'care_instructions' => ['nullable', 'string', 'max:5000'],
            'discount_amount' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'tax_amount' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'recurrence' => ['nullable', 'array'],
            'recurrence.frequency' => ['required_with:recurrence', Rule::in(['daily', 'weekly', 'monthly'])],
            'recurrence.interval' => ['nullable', 'integer', 'min:1', 'max:12'],
            'recurrence.occurrences' => ['required_with:recurrence', 'integer', 'min:2', 'max:52'],
        ];
    }

    protected function resolvedClient(): ?Client
    {
        if ($this->user()?->hasRole(['admin', 'super-admin']) && $this->input('client_id')) {
            return Client::query()->find($this->input('client_id'));
        }

        if ($this->user()?->hasRole('family-member')) {
            return $this->user()?->familyMember?->client;
        }

        return $this->user()?->client;
    }
}
