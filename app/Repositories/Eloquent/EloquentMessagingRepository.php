<?php

namespace App\Repositories\Eloquent;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Repositories\Contracts\MessagingRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EloquentMessagingRepository implements MessagingRepositoryInterface
{
    public function paginateConversations(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Conversation::query()
            ->with(['creator', 'participants', 'booking', 'messages' => fn ($query) => $query->latest('sent_at')->limit(1)])
            ->when($filters['type'] ?? null, fn ($query, string $type) => $query->where('type', $type))
            ->when($filters['booking_id'] ?? null, fn ($query, int $bookingId) => $query->where('booking_id', $bookingId))
            ->when($filters['viewer'] ?? null, fn ($query, User $viewer) => $query->whereHas('participants', fn ($query) => $query->where('users.id', $viewer->id)))
            ->latest('last_message_at')
            ->paginate($perPage);
    }

    public function createConversation(array $data, array $participantIds): Conversation
    {
        return DB::transaction(function () use ($data, $participantIds): Conversation {
            $conversation = Conversation::query()->create($data);
            $conversation->participants()->syncWithoutDetaching(
                collect($participantIds)->unique()->mapWithKeys(fn (int $userId) => [$userId => ['joined_at' => now()]])->all()
            );

            return $conversation->fresh(['creator', 'participants', 'booking']);
        });
    }

    public function paginateMessages(Conversation $conversation, int $perPage = 25): LengthAwarePaginator
    {
        return $conversation->messages()
            ->with(['sender', 'attachments', 'readReceipts.user'])
            ->latest('sent_at')
            ->paginate($perPage);
    }

    public function createMessage(Conversation $conversation, array $data): Message
    {
        return DB::transaction(function () use ($conversation, $data): Message {
            $message = $conversation->messages()->create($data);
            $conversation->update(['last_message_at' => $message->sent_at]);

            return $message->fresh(['sender', 'attachments', 'readReceipts']);
        });
    }

    public function addAttachment(Message $message, array $data): void
    {
        $message->attachments()->create($data);
    }

    public function markAsRead(Conversation $conversation, int $userId): void
    {
        DB::transaction(function () use ($conversation, $userId): void {
            $conversation->participantRecords()
                ->where('user_id', $userId)
                ->update(['last_read_at' => now()]);

            $conversation->messages()
                ->where('sender_user_id', '!=', $userId)
                ->get()
                ->each(fn (Message $message) => $message->readReceipts()->updateOrCreate(
                    ['user_id' => $userId],
                    ['read_at' => now()]
                ));
        });
    }
}
