<?php

namespace App\Http\Controllers\Messaging;

use App\Http\Controllers\Controller;
use App\Http\Requests\Messaging\ListMessagesRequest;
use App\Http\Requests\Messaging\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Services\Messaging\MessagingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MessageController extends Controller
{
    public function index(ListMessagesRequest $request, Conversation $conversation, MessagingService $messaging): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return MessageResource::collection(
            $messaging->messageHistory($conversation, (int) ($validated['per_page'] ?? 25))
        );
    }

    public function store(StoreMessageRequest $request, Conversation $conversation, MessagingService $messaging): JsonResponse
    {
        return (new MessageResource(
            $messaging->sendMessage($request->user(), $conversation, $request->validated())
        ))->response()->setStatusCode(201);
    }
}
