<?php

namespace App\Http\Requests\CaregiverManagement;

use Illuminate\Foundation\Http\FormRequest;

class UploadCaregiverDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('uploadDocument', $this->route('caregiver')) ?? false;
    }

    public function rules(): array
    {
        return [
            'document_type' => ['required', 'string', 'max:80'],
            'document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:5120'],
            'expires_at' => ['nullable', 'date', 'after:today'],
        ];
    }
}
