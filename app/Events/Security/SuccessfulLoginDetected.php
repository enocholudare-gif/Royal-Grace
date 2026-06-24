<?php

namespace App\Events\Security;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SuccessfulLoginDetected
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(
        public User $user,
        public ?string $ipAddress,
        public ?string $userAgent
    ) {
    }
}
