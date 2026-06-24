<?php

namespace Tests\Feature;

use App\Jobs\Reports\ExportReportJob;
use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use App\Models\VisitReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_admin_can_view_dashboard_metrics(): void
    {
        $admin = $this->userWithRole('admin');
        $client = $this->createClient($this->userWithRole('client'));
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $booking = $this->createBooking($client, $caregiver, 'confirmed', now()->addDay());
        $this->createPayment($admin, $booking, 5000, now()->startOfMonth()->addDay());
        $this->createVisitReport($booking, $caregiver, false);
        $this->createBooking($client, $caregiver, 'cancelled', now()->addDays(2));

        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/dashboard/metrics')
            ->assertOk()
            ->assertJsonPath('data.total_clients', 1)
            ->assertJsonPath('data.active_caregivers', 1)
            ->assertJsonPath('data.monthly_revenue', 5000.0)
            ->assertJsonPath('data.upcoming_visits', 1);
    }

    public function test_admin_can_view_revenue_report(): void
    {
        $admin = $this->userWithRole('admin');
        $client = $this->createClient($this->userWithRole('client'));
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $booking = $this->createBooking($client, $caregiver, 'confirmed', now()->addDay());
        $this->createPayment($admin, $booking, 3000, now()->subDay());
        $this->createPayment($admin, $booking, 2000, now());

        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/reports/revenue')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_admin_can_view_caregiver_booking_and_client_reports(): void
    {
        $admin = $this->userWithRole('admin');
        $client = $this->createClient($this->userWithRole('client'));
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $this->createBooking($client, $caregiver, 'completed', now()->subDay());

        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/reports/caregivers')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/admin/reports/bookings')
            ->assertOk()
            ->assertJsonStructure(['data']);

        $this->getJson('/api/admin/reports/clients')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_queue_pdf_and_excel_exports(): void
    {
        Queue::fake();

        $admin = $this->userWithRole('admin');

        Sanctum::actingAs($admin);

        $this->postJson('/api/admin/reports/revenue/export', [
            'format' => 'pdf',
        ])->assertAccepted()
            ->assertJsonPath('format', 'pdf');

        $this->postJson('/api/admin/reports/booking/export', [
            'format' => 'excel',
        ])->assertAccepted()
            ->assertJsonPath('format', 'excel');

        Queue::assertPushed(ExportReportJob::class, 2);
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

    protected function createBooking(Client $client, Caregiver $caregiver, string $status, $start): Booking
    {
        $service = Service::query()->create([
            'name' => 'Dashboard Care ' . uniqid(),
            'slug' => 'dashboard-care-' . uniqid(),
            'price' => 100,
            'duration_minutes' => 60,
            'status' => 'active',
        ]);

        return Booking::query()->create([
            'booking_number' => 'DB-' . uniqid(),
            'client_id' => $client->id,
            'service_id' => $service->id,
            'assigned_caregiver_id' => $caregiver->id,
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

    protected function createPayment(User $user, Booking $booking, float $amount, $paidAt): Payment
    {
        return Payment::query()->create([
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'provider' => 'paystack',
            'provider_payment_intent_id' => 'DBPAY-' . uniqid(),
            'amount' => $amount,
            'currency' => 'NGN',
            'status' => 'succeeded',
            'payment_type' => 'one_time',
            'paid_at' => $paidAt,
        ]);
    }

    protected function createVisitReport(Booking $booking, Caregiver $caregiver, bool $completed): VisitReport
    {
        return VisitReport::query()->create([
            'booking_id' => $booking->id,
            'caregiver_id' => $caregiver->id,
            'arrival_time' => $completed ? now()->subHour() : null,
            'departure_time' => $completed ? now() : null,
            'status' => 'draft',
        ]);
    }
}
