<?php

namespace App\Repositories\Contracts;

use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TicketRepositoryInterface
{
    public function paginateForViewer(User $viewer, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function create(array $data): SupportTicket;

    public function update(SupportTicket $ticket, array $data): SupportTicket;
}
