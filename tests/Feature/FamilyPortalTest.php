<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Client;
use App\Models\FamilyMember;
use App\Models\Invoice;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use App\Models\VisitReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FamilyPortalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_family_member_can_view_only_linked_upcoming_bookings(): void
    {
        $familyUser = $this->userWithRole('family-member');
        $familyMember = $this->createFamilyMember($familyUser, canViewBookings: true);
        $linkedBooking = $this->createBooking($familyMember->client_id, now()->addDays(2), 'confirmed');
        $otherClient = $this->createClient($this->userWithRole('client'));
        $this->createBooking($otherClient->id, now()->addDays(3), 'confirmed');

        Sanctum::actingAs($familyUser);

        $this->getJson('/api/family-portal/bookings/upcoming')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $linkedBooking->id);
    }

    public function test_family_member_can_view_completed_visits_when_enabled(): void
    {
        $familyUser = $this->userWithRole('family-member');
        $familyMember = $this->createFamilyMember($familyUser, canViewReports: true);
        $booking = $this->createBooking($familyMember->client_id, now()->subDay(), 'completed');

        VisitReport::query()->create([
            'booking_id' => $booking->id,
            'caregiver_id' => $this->createCaregiverUserRecord()->id,
            'arrival_time' => now()->subHours(3),
            'departure_time' => now()->subHours(1),
            'services_performed' => 'Meal prep',
            'client_condition' => 'Stable',
            'status' => 'submitted',
            'submitted_at' => now()->subHour(),
        ]);

        Sanctum::actingAs($familyUser);

        $this->getJson('/api/family-portal/visits/completed')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.booking_id', $booking->id);
    }

    public function test_family_member_cannot_view_visits_when_admin_disabled_flag(): void
    {
        $familyUser = $this->userWithRole('family-member');
        $this->createFamilyMember($familyUser, canViewReports: false);

        Sanctum::actingAs($familyUser);

        $this->getJson('/api/family-portal/visits/completed')
            ->assertUnprocessable();
    }

    public function test_family_member_can_view_invoices_only_when_enabled(): void
    {
        $familyUser = $this->userWithRole('family-member');
        $familyMember = $this->createFamilyMember($familyUser, canViewInvoices: true);
        $booking = $this->createBooking($familyMember->client_id, now()->addDay(), 'confirmed');

        Invoice::query()->create([
            'booking_id' => $booking->id,
            'invoice_number' => 'INV-' . uniqid(),
            'issue_date' => now()->toDateString(),
            'subtotal_amount' => $booking->subtotal_amount,
            'tax_amount' => $booking->tax_amount,
            'total_amount' => $booking->total_amount,
            'status' => 'issued',
        ]);

        Sanctum::actingAs($familyUser);

        $this->getJson('/api/family-portal/invoices')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_family_member_can_view_own_notifications_when_enabled(): void
    {
        $familyUser = $this->userWithRole('family-member');
        $this->createFamilyMember($familyUser, canReceiveNotifications: true);

        DatabaseNotification::query()->create([
            'id' => (string) str()->uuid(),
            'type' => 'TestNotification',
            'notifiable_type' => User::class,
            'notifiable_id' => $familyUser->id,
            'data' => ['message' => 'Family alert'],
        ]);

        Sanctum::actingAs($familyUser);

        $this->getJson('/api/family-portal/notifications')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.data.message', 'Family alert');
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

    protected function createFamilyMember(
        User $familyUser,
        bool $canViewBookings = true,
        bool $canViewReports = false,
        bool $canViewInvoices = false,
        bool $canReceiveNotifications = true
    ): FamilyMember {
        $client = $this->createClient($this->userWithRole('client'));

        return FamilyMember::query()->create([
            'user_id' => $familyUser->id,
            'client_id' => $client->id,
            'relationship_type' => 'daughter',
            'can_view_bookings' => $canViewBookings,
            'can_view_reports' => $canViewReports,
            'can_view_invoices' => $canViewInvoices,
            'can_receive_notifications' => $canReceiveNotifications,
            'status' => 'active',
        ]);
    }

    protected function createBooking(int $clientId, $start, string $status): Booking
    {
        $service = Service::query()->create([
            'name' => 'Family Portal Care ' . uniqid(),
            'slug' => 'family-portal-care-' . uniqid(),
            'price' => 100,
            'duration_minutes' => 60,
            'status' => 'active',
        ]);

        return Booking::query()->create([
            'booking_number' => 'FAM-' . uniqid(),
            'client_id' => $clientId,
            'service_id' => $service->id,
            'scheduled_start_at' => $start,
            'scheduled_end_at' => $start->copy()->addMinutes(60),
            'service_name_snapshot' => $service->name,
            'service_price_snapshot' => $service->price,
            'service_duration_snapshot' => $service->duration_minutes,
            'status' => $status,
            'booking_source' => 'web',
            'is_recurring' => false,
            'subtotal_amount' => $service->price,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'total_amount' => $service->price,
        ]);
    }

    protected function createCaregiverUserRecord(): \App\Models\Caregiver
    {
        $user = $this->userWithRole('caregiver');

        return \App\Models\Caregiver::query()->create([
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
}
