<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Http\Requests\Support\ListSupportTicketsRequest;
use App\Http\Requests\Support\StoreSupportTicketRequest;
use App\Http\Requests\Support\UpdateSupportTicketRequest;
use App\Http\Resources\SupportTicketResource;
use App\Models\SupportTicket;
use App\Services\Support\SupportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class SupportTicketController extends Controller
{
    public function faqs(SupportService $support): JsonResponse
    {
        return response()->json([
            'data' => $support->faqs(),
        ]);
    }

    public function index(ListSupportTicketsRequest $request, SupportService $support): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return SupportTicketResource::collection(
            $support->history($request->user(), $validated, (int) ($validated['per_page'] ?? 15))
        );
    }

    public function show(SupportTicket $supportTicket): SupportTicketResource
    {
        Gate::authorize('view', $supportTicket);

        return new SupportTicketResource($supportTicket->load(['user', 'booking', 'assignee']));
    }

    public function store(StoreSupportTicketRequest $request, SupportService $support): JsonResponse
    {
        return (new SupportTicketResource(
            $support->create($request->user(), $request->validated())
        ))->response()->setStatusCode(201);
    }

    public function update(UpdateSupportTicketRequest $request, SupportTicket $supportTicket, SupportService $support): SupportTicketResource
    {
        $validated = $request->validated();

        if (($validated['priority'] ?? null) === 'emergency') {
            return new SupportTicketResource(
                $support->escalate($request->user(), $supportTicket, $validated['assigned_to'] ?? null)
            );
        }

        if (($validated['status'] ?? null) === 'resolved') {
            return new SupportTicketResource(
                $support->resolve($supportTicket)
            );
        }

        return new SupportTicketResource(
            $supportTicket->fill($validated)->tap(fn ($ticket) => $ticket->save())->fresh()
        );
    }
}
