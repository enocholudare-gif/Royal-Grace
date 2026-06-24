<?php

namespace App\Http\Controllers\Messaging;

use App\Http\Controllers\Controller;
use App\Http\Requests\Messaging\ListConversationsRequest;
use App\Http\Requests\Messaging\MarkConversationReadRequest;
use App\Http\Requests\Messaging\StoreConversationRequest;
use App\Http\Resources\ConversationResource;
use App\Models\Conversation;
use App\Services\Messaging\MessagingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class ConversationController extends Controller
{
    public function index(ListConversationsRequest $request, MessagingService $messaging): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return ConversationResource::collection(
            $messaging->conversations($request->user(), $validated, (int) ($validated['per_page'] ?? 15))
        );
    }

    public function store(StoreConversationRequest $request, MessagingService $messaging): JsonResponse
    {
        return (new ConversationResource($messaging->createConversation($request->user(), $request->validated())))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Conversation $conversation): ConversationResource
    {
        Gate::authorize('view', $conversation);

        return new ConversationResource($conversation->load(['creator', 'participants.role', 'messages.sender', 'messages.attachments']));
    }

    public function markRead(MarkConversationReadRequest $request, Conversation $conversation, MessagingService $messaging): ConversationResource
    {
        return new ConversationResource($messaging->markAsRead($request->user(), $conversation));
    }
}
