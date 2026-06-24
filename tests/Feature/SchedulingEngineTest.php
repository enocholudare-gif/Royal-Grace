<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\CaregiverAvailability;
use App\Models\Client;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SchedulingEngineTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_client_cannot_create_overlapping_booking(): void
    {
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $service = $this->createService();
        $start = now()->addDays(3)->setTime(9, 0);

        $this->createBooking($client, $service, $start);

        Sanctum::actingAs($clientUser);

        $this->postJson('/api/bookings', [
            'service_id' => $service->id,
            'scheduled_start_at' => $start->copy()->addMinutes(30)->toDateTimeString(),
            'care_instructions' => 'Overlapping request.',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['scheduled_start_at']);
    }

    public function test_caregiver_cannot_be_double_booked(): void
    {
        $admin = $this->userWithRole('admin');
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $service = $this->createService();
        $firstClient = $this->createClient($this->userWithRole('client'));
        $secondClient = $this->createClient($this->userWithRole('client'));
        $start = now()->addDays(4)->setTime(10, 0);
        $firstBooking = $this->createBooking($firstClient, $service, $start);
        $secondBooking = $this->createBooking($secondClient, $service, $start->copy()->addMinutes(30));

        Sanctum::actingAs($admin);

        $this->patchJson("/api/bookings/{$firstBooking->id}/assign", [
            'caregiver_id' => $caregiver->id,
        ])->assertOk();

        $this->patchJson("/api/bookings/{$secondBooking->id}/assign", [
            'caregiver_id' => $caregiver->id,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['caregiver_id']);
    }

    public function test_unavailable_period_blocks_assignment(): void
    {
        $admin = $this->userWithRole('admin');
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $client = $this->createClient($this->userWithRole('client'));
        $service = $this->createService();
        $start = now()->addDays(5)->setTime(12, 0);
        $booking = $this->createBooking($client, $service, $start);

        CaregiverAvailability::query()->create([
            'caregiver_id' => $caregiver->id,
            'availability_type' => 'leave',
            'start_datetime' => $start->copy()->subHour(),
            'end_datetime' => $start->copy()->addHours(3),
            'is_recurring' => false,
        ]);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/bookings/{$booking->id}/assign", [
            'caregiver_id' => $caregiver->id,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['caregiver_id']);
    }

    public function test_assignment_auto_blocks_caregiver_period(): void
    {
        $admin = $this->userWithRole('admin');
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $client = $this->createClient($this->userWithRole('client'));
        $service = $this->createService();
        $start = now()->addDays(6)->setTime(8, 0);
        $booking = $this->createBooking($client, $service, $start);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/bookings/{$booking->id}/assign", [
            'caregiver_id' => $caregiver->id,
        ])->assertOk();

        $this->assertDatabaseHas('caregiver_availability', [
            'caregiver_id' => $caregiver->id,
            'availability_type' => 'unavailable',
            'notes' => "Auto blocked for booking {$booking->booking_number}.",
        ]);
    }

    public function test_overlapping_availability_period_is_rejected(): void
    {
        $caregiverUser = $this->userWithRole('caregiver');
        $caregiver = $this->createCaregiver($caregiverUser);
        $start = now()->addDays(2)->setTime(8, 0);

        CaregiverAvailability::query()->create([
            'caregiver_id' => $caregiver->id,
            'availability_type' => 'available',
            'start_datetime' => $start,
            'end_datetime' => $start->copy()->addHours(8),
            'is_recurring' => false,
        ]);

        Sanctum::actingAs($caregiverUser);

        $this->postJson("/api/caregivers/{$caregiver->id}/availability", [
            'availability_type' => 'unavailable',
            'start_datetime' => $start->copy()->addHour()->toDateTimeString(),
            'end_datetime' => $start->copy()->addHours(2)->toDateTimeString(),
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['end_datetime']);
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
            'name' => 'Scheduling Care ' . uniqid(),
            'slug' => 'scheduling-care-' . uniqid(),
            'description' => 'Scheduled care service.',
            'price' => 100,
            'duration_minutes' => 120,
            'status' => 'active',
        ]);
    }

    protected function createBooking(Client $client, Service $service, $start): Booking
    {
        return Booking::query()->create([
            'booking_number' => 'SCH-' . uniqid(),
            'client_id' => $client->id,
            'service_id' => $service->id,
            'scheduled_start_at' => $start,
            'scheduled_end_at' => $start->copy()->addMinutes($service->duration_minutes),
            'care_instructions' => 'Care instructions.',
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
