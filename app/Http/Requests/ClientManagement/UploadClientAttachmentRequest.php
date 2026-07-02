<?php

namespace App\Http\Requests\ClientManagement;

use Illuminate\Foundation\Http\FormRequest;

class UploadClientAttachmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attachment' => ['required', 'file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png'], // 10MB max
        ];
    }
}
