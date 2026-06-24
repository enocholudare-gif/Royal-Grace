<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\Client;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use App\Models\VisitReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VisitManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_assigned_caregiver_can_check_in_with_gps_and_device_info(): void
    {
        $caregiverUser = $this->userWithRole('caregiver');
        $caregiver = $this->createCaregiver($caregiverUser);
        $booking = $this->createAssignedBooking($caregiver);

        Sanctum::actingAs($caregiverUser);

        $this->postJson("/api/bookings/{$booking->id}/visits/check-in", [
            'latitude' => 6.5243793,
            'longitude' => 3.3792057,
            'device_info' => 'Android Chrome',
        ])->assertOk()
            ->assertJsonPath('data.booking_id', $booking->id)
            ->assertJsonPath('data.check_in_device_info', 'Android Chrome')
            ->assertJsonPath('data.status', 'draft');

        $this->assertDatabaseHas('visit_reports', [
            'booking_id' => $booking->id,
            'caregiver_id' => $caregiver->id,
            'check_in_device_info' => 'Android Chrome',
        ]);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'in_progress',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $caregiverUser->id,
            'action' => 'visit.check_in',
            'entity_type' => VisitReport::class,
        ]);
    }

    public function test_duplicate_check_in_is_prevented(): void
    {
        $caregiverUser = $this->userWithRole('caregiver');
        $caregiver = $this->createCaregiver($caregiverUser);
        $booking = $this->createAssignedBooking($caregiver);

        VisitReport::query()->create([
            'booking_id' => $booking->id,
            'caregiver_id' => $caregiver->id,
            'arrival_time' => now(),
            'check_in_latitude' => 6.5,
            'check_in_longitude' => 3.3,
            'status' => 'draft',
        ]);

        Sanctum::actingAs($caregiverUser);

        $this->postJson("/api/bookings/{$booking->id}/visits/check-in", [
            'latitude' => 6.5243793,
            'longitude' => 3.3792057,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['booking_id']);
    }

    public function test_caregiver_can_check_out_once(): void
    {
        $caregiverUser = $this->userWithRole('caregiver');
        $caregiver = $this->createCaregiver($caregiverUser);
        $booking = $this->createAssignedBooking($caregiver, ['status' => 'in_progress']);

        VisitReport::query()->create([
            'booking_id' => $booking->id,
            'caregiver_id' => $caregiver->id,
            'arrival_time' => now()->subHours(2),
            'check_in_latitude' => 6.5,
            'check_in_longitude' => 3.3,
            'status' => 'draft',
        ]);

        Sanctum::actingAs($caregiverUser);

        $this->postJson("/api/bookings/{$booking->id}/visits/check-out", [
            'latitude' => 6.5243793,
            'longitude' => 3.3792057,
            'device_info' => 'iPhone Safari',
        ])->assertOk()
            ->assertJsonPath('data.check_out_device_info', 'iPhone Safari');

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'completed',
        ]);

        $this->postJson("/api/bookings/{$booking->id}/visits/check-out", [
            'latitude' => 6.5243793,
            'longitude' => 3.3792057,
        ])->assertForbidden();
    }

    public function test_gps_coordinates_are_validated(): void
    {
        $caregiverUser = $this->userWithRole('caregiver');
        $caregiver = $this->createCaregiver($caregiverUser);
        $booking = $this->createAssignedBooking($caregiver);

        Sanctum::actingAs($caregiverUser);

        $this->postJson("/api/bookings/{$booking->id}/visits/check-in", [
            'latitude' => 100,
            'longitude' => 200,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['latitude', 'longitude']);
    }

    public function test_caregiver_can_submit_visit_report_and_client_is_notified(): void
    {
        Notification::fake();

        $caregiverUser = $this->userWithRole('caregiver');
        $caregiver = $this->createCaregiver($caregiverUser);
        $booking = $this->createAssignedBooking($caregiver, ['status' => 'completed']);

        $visitReport = VisitReport::query()->create([
            'booking_id' => $booking->id,
            'caregiver_id' => $caregiver->id,
            'arrival_time' => now()->subHours(3),
            'departure_time' => now()->subHour(),
            'check_in_latitude' => 6.5,
            'check_in_longitude' => 3.3,
            'check_out_latitude' => 6.5,
            'check_out_longitude' => 3.3,
            'status' => 'draft',
        ]);

        Sanctum::actingAs($caregiverUser);

        $this->postJson("/api/visits/{$visitReport->id}/submit", [
            'services_performed' => 'Bathing assistance and meal preparation.',
            'observations' => 'Client was cheerful.',
            'client_condition' => 'Stable',
            'notes' => 'Medication reminder completed.',
        ])->assertOk()
            ->assertJsonPath('data.status', 'submitted')
            ->assertJsonPath('data.client_condition', 'Stable');

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $caregiverUser->id,
            'action' => 'visit.report_submitted',
        ]);

        Notification::assertSentTo($booking->client->user, \App\Notifications\VisitManagement\VisitReportSubmittedNotification::class);
    }

    public function test_admin_can_review_submitted_visit_report(): void
    {
        $admin = $this->userWithRole('admin');
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $booking = $this->createAssignedBooking($caregiver, ['status' => 'completed']);
        $visitReport = VisitReport::query()->create([
            'booking_id' => $booking->id,
            'caregiver_id' => $caregiver->id,
            'arrival_time' => now()->subHours(3),
            'departure_time' => now()->subHour(),
            'services_performed' => 'Care completed.',
            'client_condition' => 'Stable',
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/visits/{$visitReport->id}/review")
            ->assertOk()
            ->assertJsonPath('data.status', 'reviewed')
            ->assertJsonPath('data.reviewed_by', $admin->id);
    }

    protected function userWithRole(string $roleSlug): User
    {
        return User::factory()->create([
            'role_id' => Role::query()->where('slug', $roleSlug)->firstOrFail()->id,
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

    protected function createAssignedBooking(Caregiver $caregiver, array $overrides = []): Booking
    {
        $clientUser = $this->userWithRole('client');
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
            'name' => 'Visit Care ' . uniqid(),
            'slug' => 'visit-care-' . uniqid(),
            'description' => 'Care service.',
            'price' => 150,
            'duration_minutes' => 120,
            'status' => 'active',
        ]);

        $start = now()->subMinutes(10);

        return Booking::query()->create(array_merge([
            'booking_number' => 'VIS-' . uniqid(),
            'client_id' => $client->id,
            'service_id' => $service->id,
            'assigned_caregiver_id' => $caregiver->id,
            'scheduled_start_at' => $start,
            'scheduled_end_at' => $start->copy()->addMinutes($service->duration_minutes),
            'care_instructions' => 'Care instructions.',
            'service_name_snapshot' => $service->name,
            'service_price_snapshot' => $service->price,
            'service_duration_snapshot' => $service->duration_minutes,
            'status' => 'assigned',
            'booking_source' => 'web',
            'is_recurring' => false,
            'subtotal_amount' => $service->price,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'total_amount' => $service->price,
        ], $overrides));
    }
}
