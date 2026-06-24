<?php

namespace App\Services\UserAccess;

use App\Models\Role;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AssignRoleService
{
    public function handle(User $user, string $roleSlug): User
    {
        $role = Role::query()->where('slug', $roleSlug)->first();

        if (! $role) {
            throw ValidationException::withMessages([
                'role' => ['The selected role is invalid.'],
            ]);
        }

        $user->forceFill([
            'role_id' => $role->id,
        ])->save();

        return $user->fresh('role');
    }
}
