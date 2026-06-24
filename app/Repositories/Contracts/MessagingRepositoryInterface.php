<?php

namespace App\Repositories\Contracts;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MessagingRepositoryInterface
{
    public function paginateConversations(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function createConversation(array $data, array $participantIds): Conversation;

    public function paginateMessages(Conversation $conversation, int $perPage = 25): LengthAwarePaginator;

    public function createMessage(Conversation $conversation, array $data): Message;

    public function addAttachment(Message $message, array $data): void;

    public function markAsRead(Conversation $conversation, int $userId): void;
}
