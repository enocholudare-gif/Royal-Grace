<?php

namespace App\Repositories\Eloquent;

use App\Models\SupportTicket;
use App\Models\User;
use App\Repositories\Contracts\TicketRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentTicketRepository implements TicketRepositoryInterface
{
    public function paginateForViewer(User $viewer, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return SupportTicket::query()
            ->with(['user', 'booking', 'assignee'])
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['priority'] ?? null, fn ($query, string $priority) => $query->where('priority', $priority))
            ->when($filters['booking_id'] ?? null, fn ($query, int $bookingId) => $query->where('booking_id', $bookingId))
            ->when($viewer->hasPermission('support.manage'), fn ($query) => $query)
            ->when($viewer->hasPermission('support.view.own'), fn ($query) => $query->where('user_id', $viewer->id))
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): SupportTicket
    {
        return SupportTicket::query()->create($data)->fresh(['user', 'booking', 'assignee']);
    }

    public function update(SupportTicket $ticket, array $data): SupportTicket
    {
        $ticket->update($data);

        return $ticket->fresh(['user', 'booking', 'assignee']);
    }
}
