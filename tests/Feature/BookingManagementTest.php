<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\Client;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BookingManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_client_can_create_single_booking(): void
    {
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $service = $this->createService();

        Sanctum::actingAs($clientUser);

        $this->postJson('/api/bookings', [
            'service_id' => $service->id,
            'scheduled_start_at' => now()->addDays(3)->setTime(9, 0)->toDateTimeString(),
            'care_instructions' => 'Please help with mobility and medication reminders.',
        ])->assertCreated()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.client_id', $client->id)
            ->assertJsonPath('data.0.status', 'awaiting_payment')
            ->assertJsonPath('data.0.service_name_snapshot', 'Personal Care');

        $this->assertDatabaseHas('bookings', [
            'client_id' => $client->id,
            'service_id' => $service->id,
            'status' => 'awaiting_payment',
            'booking_source' => 'web',
            'is_recurring' => false,
        ]);
    }

    public function test_client_can_create_recurring_bookings(): void
    {
        $clientUser = $this->userWithRole('client');
        $this->createClient($clientUser);
        $service = $this->createService();

        Sanctum::actingAs($clientUser);

        $this->postJson('/api/bookings', [
            'service_id' => $service->id,
            'scheduled_start_at' => now()->addWeek()->setTime(10, 0)->toDateTimeString(),
            'care_instructions' => 'Weekly care support.',
            'recurrence' => [
                'frequency' => 'weekly',
                'interval' => 1,
                'occurrences' => 3,
            ],
        ])->assertCreated()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.is_recurring', true);

        $groupUuid = Booking::query()->value('recurrence_group_uuid');

        $this->assertNotNull($groupUuid);
        $this->assertSame(3, Booking::query()->where('recurrence_group_uuid', $groupUuid)->count());
    }

    public function test_admin_can_assign_and_confirm_booking(): void
    {
        $admin = $this->userWithRole('admin');
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $service = $this->createService();
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $booking = $this->createBooking($client, $service);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/bookings/{$booking->id}/assign", [
            'caregiver_id' => $caregiver->id,
        ])->assertOk()
            ->assertJsonPath('data.assigned_caregiver_id', $caregiver->id)
            ->assertJsonPath('data.status', 'assigned');

        $this->patchJson("/api/bookings/{$booking->id}/confirm")
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed');
    }

    public function test_client_can_only_see_own_bookings(): void
    {
        $firstUser = $this->userWithRole('client');
        $secondUser = $this->userWithRole('client');
        $firstClient = $this->createClient($firstUser);
        $secondClient = $this->createClient($secondUser);
        $service = $this->createService();

        $this->createBooking($firstClient, $service);
        $this->createBooking($secondClient, $service);

        Sanctum::actingAs($firstUser);

        $this->getJson('/api/bookings')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.client_id', $firstClient->id);
    }

    public function test_client_can_cancel_own_booking(): void
    {
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $booking = $this->createBooking($client, $this->createService());

        Sanctum::actingAs($clientUser);

        $this->patchJson("/api/bookings/{$booking->id}/cancel", [
            'reason' => 'Schedule changed.',
        ])->assertOk()
            ->assertJsonPath('data.status', 'cancelled')
            ->assertJsonPath('data.cancellation_reason', 'Schedule changed.');
    }

    protected function userWithRole(string $roleSlug): User
    {
        return User::factory()->create([
            'role_id' => Role::query()->where('slug', $roleSlug)->firstOrFail()->id,
        ]);
    }

    protected function createClient(User $user): Client
    {
        return Client::query()->create([
            'user_id' => $user->id,
            'address_line_1' => '10 Care Street',
            'city' => 'Lagos',
            'state' => 'Lagos',
            'postal_code' => '100001',
            'country' => 'Nigeria',
            'status' => 'active',
        ]);
    }

    protected function createCaregiver(User $user): Caregiver
    {
        return Caregiver::query()->create([
            'user_id' => $user->id,
            'address_line_1' => '20 Grace Avenue',
            'city' => 'Lagos',
            'state' => 'Lagos',
            'postal_code' => '100001',
            'country' => 'Nigeria',
            'emergency_contact_name' => 'Emergency Contact',
            'emergency_contact_phone' => '08000000000',
            'is_available' => true,
            'status' => 'active',
        ]);
    }

    protected function createService(): Service
    {
        return Service::query()->create([
            'name' => 'Personal Care',
            'slug' => 'personal-care-' . uniqid(),
            'description' => 'Daily personal support.',
            'price' => 150,
            'duration_minutes' => 120,
            'status' => 'active',
        ]);
    }

    protected function createBooking(Client $client, Service $service): Booking
    {
        $start = now()->addDays(4)->setTime(11, 0);

        return Booking::query()->create([
            'booking_number' => 'TEST-' . uniqid(),
            'client_id' => $client->id,
            'service_id' => $service->id,
            'scheduled_start_at' => $start,
            'scheduled_end_at' => $start->copy()->addMinutes($service->duration_minutes),
            'care_instructions' => 'Care instructions.',
            'service_name_snapshot' => $service->name,
            'service_price_snapshot' => $service->price,
            'service_duration_snapshot' => $service->duration_minutes,
            'status' => 'awaiting_payment',
            'booking_source' => 'web',
            'is_recurring' => false,
            'subtotal_amount' => $service->price,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'total_amount' => $service->price,
        ]);
    }
}
