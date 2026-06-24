<?php

namespace Tests\Feature;

use App\Events\Support\EmergencySupportRequested;
use App\Models\Booking;
use App\Models\Client;
use App\Models\Role;
use App\Models\Service;
use App\Models\SupportTicket;
use App\Models\User;
use App\Notifications\Support\EmergencySupportAlertNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
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
        Sanctum::actingAs($this->userWithRole('client'));

        $this->getJson('/api/support/faqs')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_client_can_create_standard_support_ticket(): void
    {
        $client = $this->userWithRole('client');
        $booking = $this->createBookingForUser($client);

        Sanctum::actingAs($client);

        $this->postJson('/api/support/tickets', [
            'booking_id' => $booking->id,
            'subject' => 'Need help with invoice',
            'description' => 'I need clarification on the last invoice.',
            'priority' => 'medium',
        ])->assertCreated()
            ->assertJsonPath('data.subject', 'Need help with invoice')
            ->assertJsonPath('data.priority', 'medium')
            ->assertJsonPath('data.status', 'open');

        $this->assertDatabaseHas('support_tickets', [
            'user_id' => $client->id,
            'subject' => 'Need help with invoice',
            'priority' => 'medium',
        ]);
    }

    public function test_emergency_ticket_triggers_admin_alert(): void
    {
        Notification::fake();

        $this->userWithRole('admin');
        $client = $this->userWithRole('client');
        $booking = $this->createBookingForUser($client);

        Sanctum::actingAs($client);

        $this->postJson('/api/support/tickets', [
            'booking_id' => $booking->id,
            'subject' => 'Medical emergency',
            'description' => 'Immediate callback required.',
            'priority' => 'emergency',
        ])->assertCreated()
            ->assertJsonPath('data.priority', 'emergency');

        Notification::assertSentTo(
            User::query()->whereHas('role', fn ($query) => $query->where('slug', 'admin'))->firstOrFail(),
            EmergencySupportAlertNotification::class
        );
    }

    public function test_user_can_only_view_own_tickets(): void
    {
        $client = $this->userWithRole('client');
        $otherClient = $this->userWithRole('client');

        SupportTicket::query()->create([
            'ticket_number' => 'SUP-OWN-1',
            'user_id' => $client->id,
            'subject' => 'Own ticket',
            'description' => 'Own ticket description',
            'priority' => 'low',
            'status' => 'open',
        ]);

        SupportTicket::query()->create([
            'ticket_number' => 'SUP-OWN-2',
            'user_id' => $otherClient->id,
            'subject' => 'Other ticket',
            'description' => 'Other ticket description',
            'priority' => 'low',
            'status' => 'open',
        ]);

        Sanctum::actingAs($client);

        $this->getJson('/api/support/tickets')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.subject', 'Own ticket');
    }

    public function test_admin_can_escalate_and_resolve_ticket(): void
    {
        $admin = $this->userWithRole('admin');
        $client = $this->userWithRole('client');
        $ticket = SupportTicket::query()->create([
            'ticket_number' => 'SUP-ADM-1',
            'user_id' => $client->id,
            'subject' => 'Escalate me',
            'description' => 'Needs urgent handling',
            'priority' => 'high',
            'status' => 'open',
        ]);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/support/tickets/{$ticket->id}", [
            'priority' => 'emergency',
            'assigned_to' => $admin->id,
        ])->assertOk()
            ->assertJsonPath('data.priority', 'emergency')
            ->assertJsonPath('data.status', 'in_progress');

        $this->patchJson("/api/support/tickets/{$ticket->id}", [
            'status' => 'resolved',
        ])->assertOk()
            ->assertJsonPath('data.status', 'resolved');
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
            'user_id' => $clientUser->id,
            'address_line_1' => '10 Care Street',
            'city' => 'Lagos',
            'state' => 'Lagos',
            'postal_code' => '100001',
            'country' => 'Nigeria',
            'status' => 'active',
        ]);

        $service = Service::query()->create([
            'name' => 'Support Care ' . uniqid(),
            'slug' => 'support-care-' . uniqid(),
            'price' => 100,
            'duration_minutes' => 60,
            'status' => 'active',
        ]);

        $start = now()->addDay();

        return Booking::query()->create([
            'booking_number' => 'SUP-' . uniqid(),
            'client_id' => $client->id,
            'service_id' => $service->id,
            'scheduled_start_at' => $start,
            'scheduled_end_at' => $start->copy()->addMinutes(60),
            'service_name_snapshot' => $service->name,
            'service_price_snapshot' => $service->price,
            'service_duration_snapshot' => $service->duration_minutes,
            'status' => 'confirmed',
            'booking_source' => 'web',
            'is_recurring' => false,
            'subtotal_amount' => $service->price,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'total_amount' => $service->price,
        ]);
    }
}
