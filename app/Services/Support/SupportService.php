<?php

namespace App\Services\Support;

use App\Events\Support\EmergencySupportRequested;
use App\Models\SupportTicket;
use App\Models\User;
use App\Repositories\Contracts\TicketRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SupportService
{
    public function __construct(
        protected TicketRepositoryInterface $tickets
    ) {
    }

    public function faqs(): array
    {
        return config('faq', []);
    }

    public function history(User $viewer, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->tickets->paginateForViewer($viewer, $filters, $perPage);
    }

    public function create(User $user, array $data): SupportTicket
    {
        return DB::transaction(function () use ($user, $data): SupportTicket {
            $ticket = $this->tickets->create([
                'ticket_number' => $this->generateTicketNumber(),
                'user_id' => $user->id,
                'booking_id' => $data['booking_id'] ?? null,
                'assigned_to' => $data['assigned_to'] ?? null,
                'subject' => $data['subject'],
                'description' => $data['description'],
                'priority' => $data['priority'] ?? 'medium',
                'status' => 'open',
            ]);

            if ($ticket->priority === 'emergency') {
                EmergencySupportRequested::dispatch($ticket);
            }

            return $ticket;
        });
    }

    public function escalate(User $user, SupportTicket $ticket, ?int $assigneeId = null): SupportTicket
    {
        return $this->tickets->update($ticket, [
            'priority' => 'emergency',
            'status' => 'in_progress',
            'assigned_to' => $assigneeId,
        ]);
    }

    public function resolve(SupportTicket $ticket): SupportTicket
    {
        return $this->tickets->update($ticket, [
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);
    }

    protected function generateTicketNumber(): string
    {
        do {
            $number = 'SUP-' . now()->format('ymd') . '-' . Str::upper(Str::random(6));
        } while (SupportTicket::query()->where('ticket_number', $number)->exists());

        return $number;
    }
}
