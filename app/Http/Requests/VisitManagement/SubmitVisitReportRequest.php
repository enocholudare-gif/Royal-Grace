<?php

namespace App\Http\Requests\VisitManagement;

use Illuminate\Foundation\Http\FormRequest;

class SubmitVisitReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('submit', $this->route('visitReport')) ?? false;
    }

    public function rules(): array
    {
        return [
            'services_performed' => ['required', 'string', 'max:5000'],
            'observations' => ['nullable', 'string', 'max:5000'],
            'client_condition' => ['required', 'string', 'max:2000'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
