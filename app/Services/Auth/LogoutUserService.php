<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class LogoutUserService
{
    public function handle(User $user): void
    {
        $user->currentAccessToken()?->delete();

        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}

