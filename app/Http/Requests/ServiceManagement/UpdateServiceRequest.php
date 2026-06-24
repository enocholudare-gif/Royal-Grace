<?php

namespace App\Http\Requests\ServiceManagement;

use App\Models\Service;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('service')) ?? false;
    }

    public function rules(): array
    {
        $service = $this->route('service');
        $serviceId = $service instanceof Service ? $service->id : null;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:150', Rule::unique('services', 'name')->ignore($serviceId)],
            'slug' => ['nullable', 'string', 'max:150', Rule::unique('services', 'slug')->ignore($serviceId)],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0', 'max:9999999999.99'],
            'duration_minutes' => ['sometimes', 'required', 'integer', 'min:1', 'max:1440'],
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ];
    }
}
