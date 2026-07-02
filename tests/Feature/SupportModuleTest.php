<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Client;
use App\Models\Role;
use App\Models\Service;
use App\Models\SupportTicket;
use App\Models\User;
use App\Notifications\Support\EmergencySupportAlertNotification;
use App\Notifications\Support\NewSupportTicketNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SupportModuleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_authenticated_user_can_view_faqs(): void
    {
        $this->actingAs($this->userWithRole('client'));

        $this->getJson('/support/faq')
            ->assertOk();
    }

    public function test_client_can_create_standard_support_ticket(): void
    {
        $client = $this->userWithRole('client');

        $this->actingAs($client);

        $response = $this->postJson('/support', [
            'subject'     => 'Need help with invoice',
            'category'    => 'billing',
            'description' => 'I need clarification on the last invoice.',
            'priority'    => 'medium',
        ])->assertCreated();

        $response->assertJsonPath('ticket.subject', 'Need help with invoice')
            ->assertJsonPath('ticket.priority', 'medium')
            ->assertJsonPath('ticket.status', 'open');

        $this->assertDatabaseHas('support_tickets', [
            'user_id' => $client->id,
            'subject' => 'Need help with invoice',
            'priority' => 'medium',
        ]);
    }

    public function test_emergency_ticket_triggers_admin_alert(): void
    {
        Notification::fake();

        $admin  = $this->userWithRole('admin');
        $client = $this->userWithRole('client');

        $this->actingAs($client);

        $this->postJson('/support', [
            'subject'     => 'Medical emergency',
            'category'    => 'general',
            'description' => 'Immediate callback required.',
            'priority'    => 'emergency',
        ])->assertCreated()
            ->assertJsonPath('ticket.priority', 'emergency');

        Notification::assertSentTo($admin, EmergencySupportAlertNotification::class);
    }

    public function test_new_ticket_notifies_admins(): void
    {
        Notification::fake();

        $admin  = $this->userWithRole('admin');
        $client = $this->userWithRole('client');

        $this->actingAs($client);

        $this->postJson('/support', [
            'subject'     => 'Need help',
            'category'    => 'general',
            'description' => 'A general inquiry.',
            'priority'    => 'medium',
        ])->assertCreated();

        Notification::assertSentTo($admin, NewSupportTicketNotification::class);
    }

    public function test_user_can_only_view_own_tickets(): void
    {
        $client      = $this->userWithRole('client');
        $otherClient = $this->userWithRole('client');

        SupportTicket::query()->create([
            'ticket_number' => 'SUP-OWN-1',
            'user_id'       => $client->id,
            'subject'       => 'Own ticket',
            'description'   => 'Own ticket description',
            'priority'      => 'low',
            'status'        => 'open',
            'category'      => 'general',
        ]);

        SupportTicket::query()->create([
            'ticket_number' => 'SUP-OWN-2',
            'user_id'       => $otherClient->id,
            'subject'       => 'Other ticket',
            'description'   => 'Other ticket description',
            'priority'      => 'low',
            'status'        => 'open',
            'category'      => 'general',
        ]);

        $this->actingAs($client);

        $this->getJson('/support')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.subject', 'Own ticket');
    }

    public function test_admin_can_see_all_tickets(): void
    {
        $admin  = $this->userWithRole('admin');
        $client = $this->userWithRole('client');

        SupportTicket::query()->create([
            'ticket_number' => 'SUP-ADM-A',
            'user_id'       => $client->id,
            'subject'       => 'Client ticket',
            'description'   => 'Needs handling',
            'priority'      => 'high',
            'status'        => 'open',
            'category'      => 'general',
        ]);

        $this->actingAs($admin);

        $this->getJson('/support')
            ->assertOk()
            ->assertJsonPath('data.0.subject', 'Client ticket');
    }

    public function test_admin_can_reply_to_ticket(): void
    {
        Notification::fake();

        $admin  = $this->userWithRole('admin');
        $client = $this->userWithRole('client');

        $ticket = SupportTicket::query()->create([
            'ticket_number' => 'SUP-REPLY-1',
            'user_id'       => $client->id,
            'subject'       => 'Help me',
            'description'   => 'I need help.',
            'priority'      => 'medium',
            'status'        => 'open',
            'category'      => 'general',
        ]);

        $this->actingAs($admin);

        $this->postJson("/support/{$ticket->id}/reply", [
            'message' => 'Hi, we are looking into this.',
        ])->assertOk()
            ->assertJsonPath('data.message', 'Hi, we are looking into this.')
            ->assertJsonPath('data.is_admin_reply', true);

        $this->assertDatabaseHas('support_ticket_messages', [
            'support_ticket_id' => $ticket->id,
            'user_id'           => $admin->id,
            'is_admin_reply'    => true,
        ]);

        $ticket->refresh();
        $this->assertEquals('in_progress', $ticket->status);
    }

    public function test_admin_can_update_ticket_status(): void
    {
        $admin  = $this->userWithRole('admin');
        $client = $this->userWithRole('client');

        $ticket = SupportTicket::query()->create([
            'ticket_number' => 'SUP-ADM-1',
            'user_id'       => $client->id,
            'subject'       => 'Escalate me',
            'description'   => 'Needs urgent handling',
            'priority'      => 'high',
            'status'        => 'open',
            'category'      => 'general',
        ]);

        $this->actingAs($admin);

        $this->putJson("/support/{$ticket->id}", [
            'status'   => 'in_progress',
            'priority' => 'emergency',
        ])->assertOk()
            ->assertJsonPath('ticket.status', 'in_progress');

        $this->putJson("/support/{$ticket->id}", [
            'status' => 'resolved',
        ])->assertOk()
            ->assertJsonPath('ticket.status', 'resolved');
    }

    public function test_client_cannot_view_another_clients_ticket(): void
    {
        $client      = $this->userWithRole('client');
        $otherClient = $this->userWithRole('client');

        $ticket = SupportTicket::query()->create([
            'ticket_number' => 'SUP-SEC-1',
            'user_id'       => $otherClient->id,
            'subject'       => 'Secret ticket',
            'description'   => 'Private issue',
            'priority'      => 'low',
            'status'        => 'open',
            'category'      => 'general',
        ]);

        $this->actingAs($client);

        $this->getJson("/support/{$ticket->id}")
            ->assertForbidden();
    }

    protected function userWithRole(string $roleSlug): User
    {
        return User::factory()->create([
            'role_id' => Role::query()->where('slug', $roleSlug)->firstOrFail()->id,
        ]);
    }

    protected function createBookingForUser(User $clientUser): Booking
    {
        $client = Client::query()->create([
            'user_id'       => $clientUser->id,
            'address_line_1' => '10 Care Street',
            'city'          => 'Lagos',
            'state'         => 'Lagos',
            'postal_code'   => '100001',
            'country'       => 'Nigeria',
            'status'        => 'active',
        ]);

        $service = Service::query()->create([
            'name'             => 'Support Care ' . uniqid(),
            'slug'             => 'support-care-' . uniqid(),
            'price'            => 100,
            'duration_minutes' => 60,
            'status'           => 'active',
        ]);

        $start = now()->addDay();

        return Booking::query()->create([
            'booking_number'           => 'SUP-' . uniqid(),
            'client_id'                => $client->id,
            'service_id'               => $service->id,
            'scheduled_start_at'       => $start,
            'scheduled_end_at'         => $start->copy()->addMinutes(60),
            'service_name_snapshot'    => $service->name,
            'service_price_snapshot'   => $service->price,
            'service_duration_snapshot' => $service->duration_minutes,
            'status'                   => 'confirmed',
            'booking_source'           => 'web',
            'is_recurring'             => false,
            'subtotal_amount'          => $service->price,
            'discount_amount'          => 0,
            'tax_amount'               => 0,
            'total_amount'             => $service->price,
        ]);
    }
}
