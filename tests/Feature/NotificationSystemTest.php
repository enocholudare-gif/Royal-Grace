<?php

namespace Tests\Feature;

use App\Events\BookingManagement\BookingAssigned;
use App\Events\BookingManagement\BookingCancelled;
use App\Events\BookingManagement\BookingCreated;
use App\Events\PaymentManagement\PaymentSucceeded;
use App\Events\VisitManagement\CaregiverCheckedIn;
use App\Events\VisitManagement\CaregiverCheckedOut;
use App\Jobs\Notifications\SendFcmNotificationJob;
use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use App\Models\VisitReport;
use App\Notifications\System\BookingAssignedNotification;
use App\Notifications\System\BookingCancelledNotification;
use App\Notifications\System\BookingCreatedNotification;
use App\Notifications\System\PaymentSuccessfulNotification;
use App\Notifications\System\VisitCompletedNotification;
use App\Notifications\System\VisitStartedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\SendQueuedNotifications;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationSystemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_booking_events_send_queued_notifications(): void
    {
        Notification::fake();

        $admin = $this->userWithRole('admin');
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $booking = $this->createBooking($caregiver);

        event(new BookingCreated($booking));
        event(new BookingAssigned($booking));
        event(new BookingCancelled($booking));

        Notification::assertSentTo($booking->client->user, BookingCreatedNotification::class);
        Notification::assertSentTo($booking->client->user, BookingAssignedNotification::class);
        Notification::assertSentTo($caregiver->user, BookingAssignedNotification::class);
        Notification::assertSentTo($booking->client->user, BookingCancelledNotification::class);
        Notification::assertSentTo($admin, BookingCancelledNotification::class);
    }

    public function test_payment_and_visit_events_send_queued_notifications(): void
    {
        Notification::fake();

        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $booking = $this->createBooking($caregiver);
        $payment = $this->createPayment($booking->client->user, $booking);
        $visitReport = $this->createVisitReport($booking, $caregiver);

        event(new PaymentSucceeded($payment));
        event(new CaregiverCheckedIn($visitReport));
        event(new CaregiverCheckedOut($visitReport));

        Notification::assertSentTo($booking->client->user, PaymentSuccessfulNotification::class);
        Notification::assertSentTo($booking->client->user, VisitStartedNotification::class);
        Notification::assertSentTo($booking->client->user, VisitCompletedNotification::class);
    }

    public function test_ajax_notification_endpoints_work(): void
    {
        $user = $this->userWithRole('client');
        DatabaseNotification::query()->create([
            'id' => (string) str()->uuid(),
            'type' => BookingCreatedNotification::class,
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => ['type' => 'booking_created', 'title' => 'Booking Created'],
        ]);

        Sanctum::actingAs($user);

        $notificationId = $this->getJson('/api/notifications?unread=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->json('data.0.id');

        $this->getJson('/api/notifications/unread-count')
            ->assertOk()
            ->assertJsonPath('unread_count', 1);

        $this->postJson('/api/notifications/mark-read', [
            'notification_id' => $notificationId,
        ])->assertOk();

        $this->getJson('/api/notifications/unread-count')
            ->assertOk()
            ->assertJsonPath('unread_count', 0);
    }

    public function test_notification_preferences_and_fcm_token_can_be_saved(): void
    {
        $user = $this->userWithRole('client');

        Sanctum::actingAs($user);

        $this->putJson('/api/notifications/preferences', [
            'notification_type' => 'booking_created',
            'email_enabled' => false,
            'fcm_enabled' => true,
        ])->assertStatus(201)
            ->assertJsonPath('data.notification_type', 'booking_created')
            ->assertJsonPath('data.email_enabled', false)
            ->assertJsonPath('data.fcm_enabled', true);

        $this->postJson('/api/notifications/fcm-token', [
            'token' => 'test-fcm-token',
            'device_type' => 'web',
            'device_name' => 'Chrome',
        ])->assertStatus(201)
            ->assertJsonPath('data.device_type', 'web');

        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $user->id,
            'notification_type' => 'booking_created',
            'email_enabled' => false,
            'fcm_enabled' => true,
        ]);

        $this->assertDatabaseHas('user_fcm_tokens', [
            'user_id' => $user->id,
            'token' => 'test-fcm-token',
        ]);
    }

    public function test_fcm_channel_dispatches_background_job(): void
    {
        Queue::fake();

        $user = $this->userWithRole('client');
        $booking = $this->createBooking();
        $user->fcmTokens()->create(['token' => 'fcm-token']);

        $user->notify(new BookingCreatedNotification($booking));

        Queue::assertPushed(SendQueuedNotifications::class);
    }

    public function test_required_events_are_registered(): void
    {
        Event::fake();

        Event::assertListening(BookingCreated::class, \App\Listeners\Notifications\SendBookingCreatedNotification::class);
        Event::assertListening(BookingAssigned::class, \App\Listeners\Notifications\SendBookingAssignedNotification::class);
        Event::assertListening(BookingCancelled::class, \App\Listeners\Notifications\SendBookingCancelledNotification::class);
        Event::assertListening(PaymentSucceeded::class, \App\Listeners\Notifications\SendPaymentSuccessfulNotification::class);
        Event::assertListening(CaregiverCheckedIn::class, \App\Listeners\Notifications\SendVisitStartedNotification::class);
        Event::assertListening(CaregiverCheckedOut::class, \App\Listeners\Notifications\SendVisitCompletedNotification::class);
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

    protected function createBooking(?Caregiver $caregiver = null): Booking
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
            'name' => 'Notification Care ' . uniqid(),
            'slug' => 'notification-care-' . uniqid(),
            'price' => 100,
            'duration_minutes' => 60,
            'status' => 'active',
        ]);

        $start = now()->addDay();

        return Booking::query()->create([
            'booking_number' => 'NOT-' . uniqid(),
            'client_id' => $client->id,
            'service_id' => $service->id,
            'assigned_caregiver_id' => $caregiver?->id,
            'scheduled_start_at' => $start,
            'scheduled_end_at' => $start->copy()->addMinutes(60),
            'service_name_snapshot' => $service->name,
            'service_price_snapshot' => $service->price,
            'service_duration_snapshot' => $service->duration_minutes,
            'status' => $caregiver ? 'assigned' : 'awaiting_payment',
            'booking_source' => 'web',
            'is_recurring' => false,
            'subtotal_amount' => $service->price,
            'discount_amount' => 0,
            'tax_amount' => 0,
            'total_amount' => $service->price,
        ]);
    }

    protected function createPayment(User $user, Booking $booking): Payment
    {
        return Payment::query()->create([
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'provider' => 'paystack',
            'provider_payment_intent_id' => 'REF-' . uniqid(),
            'amount' => $booking->total_amount,
            'currency' => 'NGN',
            'status' => 'succeeded',
            'payment_type' => 'one_time',
            'paid_at' => now(),
        ]);
    }

    protected function createVisitReport(Booking $booking, Caregiver $caregiver): VisitReport
    {
        return VisitReport::query()->create([
            'booking_id' => $booking->id,
            'caregiver_id' => $caregiver->id,
            'arrival_time' => now()->subHour(),
            'departure_time' => now(),
            'check_in_latitude' => 6.5243793,
            'check_in_longitude' => 3.3792057,
            'check_out_latitude' => 6.5243793,
            'check_out_longitude' => 3.3792057,
            'status' => 'draft',
        ]);
    }
}
