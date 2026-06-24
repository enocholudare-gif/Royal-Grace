<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginUserService
{
    public function handle(array $credentials): array
    {
        $user = User::query()->where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status === 'suspended' || $user->status === 'inactive') {
            throw ValidationException::withMessages([
                'email' => ['This account is not allowed to log in.'],
            ]);
        }

        $user->forceFill([
            'last_login_at' => now(),
            'last_login_ip' => request()->ip(),
        ])->save();

        $token = $user->createToken($credentials['device_name'] ?? 'web')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
