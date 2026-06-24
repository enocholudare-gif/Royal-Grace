<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('assignRole', $this->route('user')) ?? false;
    }

    public function rules(): array
    {
        return [
            'role' => ['required', 'string', Rule::in(array_keys(config('rbac.roles')))],
        ];
    }
}
