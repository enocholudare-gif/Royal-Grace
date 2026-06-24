<?php

namespace App\Services\Security;

use App\Events\Security\FailedLoginDetected;
use App\Events\Security\SuccessfulLoginDetected;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class LoginMonitoringService
{
    public function __construct(
        protected AuditService $audit
    ) {
    }

    public function recordSuccess(User $user, Request $request): void
    {
        Cache::forget($this->failedLoginKey($request));

        $this->audit->log(
            action: 'auth.login.success',
            entityType: User::class,
            entityId: $user->id,
            user: $user,
            request: $request,
            metadata: [
                'email' => $user->email,
            ]
        );

        SuccessfulLoginDetected::dispatch($user, $request->ip(), (string) $request->userAgent());
    }

    public function recordFailure(string $email, Request $request): int
    {
        $key = $this->failedLoginKey($request);
        $count = (int) Cache::get($key, 0) + 1;
        Cache::put($key, $count, now()->addMinutes(30));

        $this->audit->log(
            action: 'auth.login.failed',
            entityType: User::class,
            entityId: null,
            user: null,
            request: $request,
            metadata: [
                'email' => $email,
                'attempts' => $count,
            ]
        );

        FailedLoginDetected::dispatch($email, $count, $request->ip(), (string) $request->userAgent());

        return $count;
    }

    protected function failedLoginKey(Request $request): string
    {
        return 'failed-logins:' . sha1(($request->input('email') ?? 'unknown') . '|' . $request->ip());
    }
}
