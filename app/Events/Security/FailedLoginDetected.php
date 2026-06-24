<?php

namespace App\Events\Security;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FailedLoginDetected
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(
        public string $email,
        public int $attempts,
        public ?string $ipAddress,
        public ?string $userAgent
    ) {
    }
}
