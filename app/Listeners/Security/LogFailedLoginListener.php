<?php

namespace App\Listeners\Security;

use App\Events\Security\FailedLoginDetected;
use App\Services\Security\AuditService;

class LogFailedLoginListener
{
    public function __construct(
        protected AuditService $audit
    ) {
    }

    public function handle(FailedLoginDetected $event): void
    {
        $this->audit->log(
            action: 'security.failed_login_detected',
            entityType: 'security',
            entityId: null,
            user: null,
            request: null,
            metadata: [
                'email' => $event->email,
                'attempts' => $event->attempts,
                'ip_address' => $event->ipAddress,
                'user_agent' => $event->userAgent,
            ]
        );
    }
}
