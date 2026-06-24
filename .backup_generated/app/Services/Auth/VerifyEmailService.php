<?php

namespace App\Services\Auth;

use Illuminate\Foundation\Auth\EmailVerificationRequest;

class VerifyEmailService
{
    public function handle(EmailVerificationRequest $request): void
    {
        if (! $request->user()->hasVerifiedEmail()) {
            $request->fulfill();
        }
    }
}
