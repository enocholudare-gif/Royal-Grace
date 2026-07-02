<?php

namespace App\Services\Messaging;

use App\Events\Messaging\ConversationRead;
use App\Events\Messaging\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Notifications\Messaging\NewMessageNotification;
use App\Repositories\Contracts\MessagingRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MessagingService
{
    public function __construct(
        protected MessagingRepositoryInterface $messages
    ) {
    }

    public function conversations(User $viewer, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $filters['viewer'] = $viewer;

        return $this->messages->paginateConversations($filters, $perPage);
    }

    public function createConversation(User $creator, array $data): Conversation
    {
        $participantIds = collect($data['participant_ids'] ?? [])
            ->push($creator->id)
            ->unique()
            ->values()
            ->all();

        $this->ensureAllowedParticipants($creator, $participantIds);

        return $this->messages->createConversation([
            'booking_id' => $data['booking_id'] ?? null,
            'created_by' => $creator->id,
            'subject' => $data['subject'] ?? null,
            'type' => $data['type'] ?? 'general',
        ], $participantIds);
    }

    public function messageHistory(Conversation $conversation, int $perPage = 25): LengthAwarePaginator
    {
        return $this->messages->paginateMessages($conversation, $perPage);
    }

    public function sendMessage(User $sender, Conversation $conversation, array $data): Message
    {
        return DB::transaction(function () use ($sender, $conversation, $data): Message {
            if (! $conversation->participants()->where('users.id', $sender->id)->exists()) {
                throw ValidationException::withMessages([
                    'conversation_id' => ['Sender is not a participant in this conversation.'],
                ]);
            }

            $attachments = $data['attachments'] ?? [];
            $message = $this->messages->createMessage($conversation, [
                'sender_user_id' => $sender->id,
                'body' => $data['body'] ?? null,
                'message_type' => count($attachments) > 0 ? 'attachment' : 'text',
                'sent_at' => now(),
            ]);

            foreach ($attachments as $attachment) {
                $this->storeAttachment($message, $sender, $attachment);
            }

            $message = $message->fresh(['conversation.participants', 'sender', 'attachments', 'readReceipts']);
            MessageSent::dispatch($message);

            $message->conversation->participants
                ->where('id', '!=', $sender->id)
                ->each(fn (User $participant) => $participant->notify(new NewMessageNotification($message)));

            return $message;
        });
    }

    public function markAsRead(User $reader, Conversation $conversation): Conversation
    {
        if (! $conversation->participants()->where('users.id', $reader->id)->exists()) {
            throw ValidationException::withMessages([
                'conversation_id' => ['Reader is not a participant in this conversation.'],
            ]);
        }

        $this->messages->markAsRead($conversation, $reader->id);
        ConversationRead::dispatch($conversation, $reader);

        return $conversation->fresh(['participants', 'messages.readReceipts']);
    }

    protected function storeAttachment(Message $message, User $sender, UploadedFile $attachment): void
    {
        $disk = config('filesystems.default', 'local');
        $path = $attachment->store("messages/{$message->conversation_id}", $disk);

        $this->messages->addAttachment($message, [
            'uploaded_by' => $sender->id,
            'original_name' => $attachment->getClientOriginalName(),
            'disk' => $disk,
            'path' => $path,
            'mime_type' => $attachment->getClientMimeType(),
            'size_bytes' => $attachment->getSize(),
        ]);
    }

    protected function ensureAllowedParticipants(User $creator, array $participantIds): void
    {
        $users = User::query()->with('role')->whereIn('id', $participantIds)->get();
        $allowedRoles = ['super-admin', 'admin', 'client', 'family-member', 'caregiver'];

        if ($users->count() !== count($participantIds)) {
            throw ValidationException::withMessages([
                'participant_ids' => ['One or more participants are invalid.'],
            ]);
        }

        if ($users->contains(fn (User $user) => ! in_array($user->role?->slug, $allowedRoles, true))) {
            throw ValidationException::withMessages([
                'participant_ids' => ['Only clients, family members, caregivers, and admins can participate in messaging.'],
            ]);
        }

        if (! $creator->hasPermission('messages.manage') && ! in_array($creator->role?->slug, ['client', 'family-member', 'caregiver'], true)) {
            throw ValidationException::withMessages([
                'participant_ids' => ['User cannot create this conversation.'],
            ]);
        }
    }
}
