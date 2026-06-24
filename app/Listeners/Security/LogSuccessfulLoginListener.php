<?php

namespace App\Listeners\Security;

use App\Events\Security\SuccessfulLoginDetected;
use App\Services\Security\AuditService;

class LogSuccessfulLoginListener
{
    public function __construct(
        protected AuditService $audit
    ) {
    }

    public function handle(SuccessfulLoginDetected $event): void
    {
        $this->audit->log(
            action: 'security.successful_login_detected',
            entityType: $event->user::class,
            entityId: $event->user->id,
            user: $event->user,
            request: null,
            metadata: [
                'ip_address' => $event->ipAddress,
                'user_agent' => $event->userAgent,
            ]
        );
    }
}
