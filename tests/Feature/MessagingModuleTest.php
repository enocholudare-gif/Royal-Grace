<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MessagingModuleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_client_can_create_conversation_with_admin_and_family_member(): void
    {
        $client = $this->userWithRole('client');
        $admin = $this->userWithRole('admin');
        $family = $this->userWithRole('family-member');

        Sanctum::actingAs($client);

        $this->postJson('/api/conversations', [
            'subject' => 'Care update',
            'type' => 'family',
            'participant_ids' => [$admin->id, $family->id],
        ])->assertCreated()
            ->assertJsonPath('data.subject', 'Care update')
            ->assertJsonCount(3, 'data.participants');

        $this->assertDatabaseHas('conversation_participants', ['user_id' => $client->id]);
        $this->assertDatabaseHas('conversation_participants', ['user_id' => $admin->id]);
        $this->assertDatabaseHas('conversation_participants', ['user_id' => $family->id]);
    }

    public function test_participant_can_send_message_and_notify_others(): void
    {
        Notification::fake();

        $client = $this->userWithRole('client');
        $admin = $this->userWithRole('admin');
        $conversation = $this->createConversation($client, [$admin]);

        Sanctum::actingAs($client);

        $this->postJson("/api/conversations/{$conversation->id}/messages", [
            'body' => 'Hello admin, please check this update.',
        ])->assertCreated()
            ->assertJsonPath('data.body', 'Hello admin, please check this update.')
            ->assertJsonPath('data.message_type', 'text');

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'sender_user_id' => $client->id,
            'body' => 'Hello admin, please check this update.',
        ]);

        Notification::assertSentTo($admin, \App\Notifications\Messaging\NewMessageNotification::class);
    }

    public function test_message_can_include_attachments(): void
    {
        Storage::fake('local');

        $client = $this->userWithRole('client');
        $admin = $this->userWithRole('admin');
        $conversation = $this->createConversation($client, [$admin]);

        Sanctum::actingAs($admin);

        $this->postJson("/api/conversations/{$conversation->id}/messages", [
            'body' => 'Please see attachment.',
            'attachments' => [
                UploadedFile::fake()->create('care-plan.pdf', 120, 'application/pdf'),
            ],
        ])->assertCreated()
            ->assertJsonPath('data.message_type', 'attachment')
            ->assertJsonCount(1, 'data.attachments');

        $this->assertDatabaseHas('message_attachments', [
            'uploaded_by' => $admin->id,
            'original_name' => 'care-plan.pdf',
        ]);
    }

    public function test_message_history_is_limited_to_participants(): void
    {
        $client = $this->userWithRole('client');
        $admin = $this->userWithRole('admin');
        $outsider = $this->userWithRole('client');
        $conversation = $this->createConversation($client, [$admin]);

        $conversation->messages()->create([
            'sender_user_id' => $client->id,
            'body' => 'Private message.',
            'message_type' => 'text',
            'sent_at' => now(),
        ]);

        Sanctum::actingAs($outsider);

        $this->getJson("/api/conversations/{$conversation->id}/messages")
            ->assertForbidden();
    }

    public function test_participant_can_mark_conversation_as_read(): void
    {
        $client = $this->userWithRole('client');
        $admin = $this->userWithRole('admin');
        $conversation = $this->createConversation($client, [$admin]);
        $message = $conversation->messages()->create([
            'sender_user_id' => $client->id,
            'body' => 'Please read this.',
            'message_type' => 'text',
            'sent_at' => now(),
        ]);

        Sanctum::actingAs($admin);

        $this->postJson("/api/conversations/{$conversation->id}/read")
            ->assertOk();

        $this->assertDatabaseHas('conversation_participants', [
            'conversation_id' => $conversation->id,
            'user_id' => $admin->id,
        ]);

        $this->assertDatabaseHas('message_read_receipts', [
            'message_id' => $message->id,
            'user_id' => $admin->id,
        ]);
    }

    public function test_caregiver_cannot_be_added_as_messaging_participant(): void
    {
        $client = $this->userWithRole('client');
        $caregiver = $this->userWithRole('caregiver');

        Sanctum::actingAs($client);

        $this->postJson('/api/conversations', [
            'subject' => 'Invalid participant',
            'type' => 'general',
            'participant_ids' => [$caregiver->id],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['participant_ids']);
    }

    protected function userWithRole(string $roleSlug): User
    {
        return User::factory()->create([
            'role_id' => Role::query()->where('slug', $roleSlug)->firstOrFail()->id,
        ]);
    }

    protected function createConversation(User $creator, array $participants): Conversation
    {
        $conversation = Conversation::query()->create([
            'created_by' => $creator->id,
            'subject' => 'Conversation',
            'type' => 'general',
        ]);

        $conversation->participants()->syncWithoutDetaching(
            collect($participants)
                ->push($creator)
                ->mapWithKeys(fn (User $user) => [$user->id => ['joined_at' => now()]])
                ->all()
        );

        return $conversation;
    }
}
