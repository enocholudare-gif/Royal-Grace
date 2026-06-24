<?php

namespace Tests\Feature;

use App\Events\Ratings\LowRatingSubmitted;
use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\Client;
use App\Models\Rating;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use App\Notifications\Ratings\LowRatingAlertNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RatingModuleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_client_can_submit_five_star_rating_with_comment(): void
    {
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $booking = $this->createCompletedBooking($client, $caregiver);

        Sanctum::actingAs($clientUser);

        $this->postJson("/api/bookings/{$booking->id}/ratings", [
            'rating' => 5,
            'comment' => 'Excellent care and professionalism.',
        ])->assertCreated()
            ->assertJsonPath('data.rating', 5)
            ->assertJsonPath('data.comment', 'Excellent care and professionalism.');

        $this->assertDatabaseHas('ratings', [
            'booking_id' => $booking->id,
            'client_id' => $client->id,
            'caregiver_id' => $caregiver->id,
            'rating' => 5,
        ]);
    }

    public function test_client_can_view_rating_history(): void
    {
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $booking = $this->createCompletedBooking($client, $caregiver);

        Rating::query()->create([
            'booking_id' => $booking->id,
            'client_id' => $client->id,
            'caregiver_id' => $caregiver->id,
            'rating' => 4,
            'comment' => 'Solid service.',
            'submitted_at' => now(),
        ]);

        Sanctum::actingAs($clientUser);

        $this->getJson('/api/ratings')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.rating', 4);
    }

    public function test_duplicate_rating_for_same_booking_is_blocked(): void
    {
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $booking = $this->createCompletedBooking($client, $caregiver);

        Rating::query()->create([
            'booking_id' => $booking->id,
            'client_id' => $client->id,
            'caregiver_id' => $caregiver->id,
            'rating' => 4,
            'submitted_at' => now(),
        ]);

        Sanctum::actingAs($clientUser);

        $this->postJson("/api/bookings/{$booking->id}/ratings", [
            'rating' => 5,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['booking_id']);
    }

    public function test_low_rating_triggers_admin_alert(): void
    {
        Notification::fake();

        $admin = $this->userWithRole('admin');
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $booking = $this->createCompletedBooking($client, $caregiver);

        Sanctum::actingAs($clientUser);

        $this->postJson("/api/bookings/{$booking->id}/ratings", [
            'rating' => 2,
            'comment' => 'Late arrival and poor communication.',
        ])->assertCreated();

        Notification::assertSentTo($admin, LowRatingAlertNotification::class);
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

    protected function createCompletedBooking(Client $client, Caregiver $caregiver): Booking
    {
        $service = Service::query()->create([
            'name' => 'Rating Care ' . uniqid(),
            'slug' => 'rating-care-' . uniqid(),
            'price' => 100,
            'duration_minutes' => 60,
            'status' => 'active',
        ]);

        $start = now()->subDay();

        return Booking::query()->create([
            'booking_number' => 'RAT-' . uniqid(),
            'client_id' => $client->id,
            'service_id' => $service->id,
            'assigned_caregiver_id' => $caregiver->id,
            'scheduled_start_at' => $start,
            'scheduled_end_at' => $start->copy()->addMinutes(60),
            'service_name_snapshot' => $service->name,
            'service_price_snapshot' => $service->price,
            'service_duration_snapshot' => $service->duration_minutes,
            'status' => 'completed',
            'booking_source' => 'web',
            'is_recurring' => false,
            'subtotal_amount' => $service->price,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'total_amount' => $service->price,
        ]);
    }
}
