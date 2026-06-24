<?php

namespace App\Events\Messaging;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationRead implements ShouldBroadcast
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public Conversation $conversation, public User $reader)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("conversations.{$this->conversation->id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'conversation.read';
    }

    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversation->id,
            'reader_user_id' => $this->reader->id,
            'read_at' => now()->toISOString(),
        ];
    }
}
