<?php

namespace App\Http\Requests\ServiceManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\Service::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150', 'unique:services,name'],
            'slug' => ['nullable', 'string', 'max:150', 'unique:services,slug'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
        ];
    }
}
