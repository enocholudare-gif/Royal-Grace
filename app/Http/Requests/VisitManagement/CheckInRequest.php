<?php

namespace App\Http\Requests\VisitManagement;

use Illuminate\Foundation\Http\FormRequest;

class CheckInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('checkIn', $this->route('booking')) ?? false;
    }

    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'device_info' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
