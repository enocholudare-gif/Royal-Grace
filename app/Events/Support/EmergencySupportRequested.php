<?php

namespace App\Events\Support;

use App\Models\SupportTicket;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EmergencySupportRequested
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public SupportTicket $ticket)
    {
    }
}
