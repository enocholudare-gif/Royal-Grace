<?php

namespace App\Http\Requests\Pwa;

use Illuminate\Foundation\Http\FormRequest;

class MarkSyncCompletedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [];
    }
}
