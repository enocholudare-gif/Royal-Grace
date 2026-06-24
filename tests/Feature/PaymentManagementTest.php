<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaymentManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
        config()->set('services.paystack.secret_key', 'test_secret_key');
        config()->set('services.paystack.base_url', 'https://api.paystack.co');
    }

    public function test_client_can_initialize_booking_payment_with_paystack(): void
    {
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $booking = $this->createBooking($client, $this->createService());

        Http::fake([
            'api.paystack.co/transaction/initialize' => Http::response([
                'status' => true,
                'data' => [
                    'authorization_url' => 'https://checkout.paystack.com/test',
                    'access_code' => 'access_code',
                    'reference' => 'ignored',
                ],
            ]),
        ]);

        Sanctum::actingAs($clientUser);

        $this->postJson("/api/bookings/{$booking->id}/payments/paystack")
            ->assertCreated()
            ->assertJsonPath('data.provider', 'paystack')
            ->assertJsonPath('data.status', 'processing')
            ->assertJsonPath('data.authorization_url', 'https://checkout.paystack.com/test');

        $this->assertDatabaseHas('payments', [
            'booking_id' => $booking->id,
            'user_id' => $clientUser->id,
            'provider' => 'paystack',
            'status' => 'processing',
            'payment_type' => 'one_time',
            'currency' => 'NGN',
        ]);
    }

    public function test_payment_verification_confirms_booking_and_queues_receipt(): void
    {
        Notification::fake();

        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $booking = $this->createBooking($client, $this->createService());
        $payment = $this->createPayment($clientUser, $booking);

        Http::fake([
            "api.paystack.co/transaction/verify/{$payment->provider_payment_intent_id}" => Http::response([
                'status' => true,
                'data' => [
                    'id' => 123456,
                    'reference' => $payment->provider_payment_intent_id,
                    'status' => 'success',
                    'gateway_response' => 'Successful',
                    'channel' => 'card',
                ],
            ]),
        ]);

        Sanctum::actingAs($clientUser);

        $this->postJson('/api/payments/verify', [
            'reference' => $payment->provider_payment_intent_id,
        ])->assertOk()
            ->assertJsonPath('data.status', 'succeeded')
            ->assertJsonPath('data.provider_charge_id', '123456');

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'confirmed',
        ]);

        Notification::assertSentTo($clientUser, \App\Notifications\PaymentManagement\PaymentReceiptNotification::class);
    }

    public function test_admin_can_generate_invoice_and_client_can_pay_invoice(): void
    {
        $admin = $this->userWithRole('admin');
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $booking = $this->createBooking($client, $this->createService());

        Sanctum::actingAs($admin);

        $invoiceId = $this->postJson("/api/bookings/{$booking->id}/invoice")
            ->assertCreated()
            ->assertJsonPath('data.status', 'issued')
            ->json('data.id');

        Http::fake([
            'api.paystack.co/transaction/initialize' => Http::response([
                'status' => true,
                'data' => [
                    'authorization_url' => 'https://checkout.paystack.com/invoice',
                    'access_code' => 'invoice_access',
                ],
            ]),
        ]);

        Sanctum::actingAs($clientUser);

        $this->postJson("/api/invoices/{$invoiceId}/payments/paystack")
            ->assertCreated()
            ->assertJsonPath('data.payment_type', 'invoice')
            ->assertJsonPath('data.invoice_id', $invoiceId);
    }

    public function test_webhook_success_is_idempotent(): void
    {
        Notification::fake();

        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $booking = $this->createBooking($client, $this->createService());
        $payment = $this->createPayment($clientUser, $booking);
        $payload = [
            'event' => 'charge.success',
            'data' => [
                'id' => 777,
                'reference' => $payment->provider_payment_intent_id,
                'status' => 'success',
                'gateway_response' => 'Successful',
            ],
        ];
        $json = json_encode($payload);
        $signature = hash_hmac('sha512', $json, 'test_secret_key');

        $this->postJson('/api/webhooks/paystack', $payload, ['x-paystack-signature' => $signature])
            ->assertOk();

        $this->postJson('/api/webhooks/paystack', $payload, ['x-paystack-signature' => $signature])
            ->assertOk();

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'succeeded',
            'provider_charge_id' => '777',
        ]);

        Notification::assertSentToTimes($clientUser, \App\Notifications\PaymentManagement\PaymentReceiptNotification::class, 1);
    }

    public function test_admin_can_process_refund(): void
    {
        $admin = $this->userWithRole('admin');
        $clientUser = $this->userWithRole('client');
        $client = $this->createClient($clientUser);
        $booking = $this->createBooking($client, $this->createService());
        $payment = $this->createPayment($clientUser, $booking, [
            'status' => 'succeeded',
            'provider_charge_id' => '123456',
            'paid_at' => now(),
        ]);

        Http::fake([
            'api.paystack.co/refund' => Http::response([
                'status' => true,
                'data' => [
                    'id' => 999,
                    'status' => 'processed',
                ],
            ]),
        ]);

        Sanctum::actingAs($admin);

        $this->postJson("/api/payments/{$payment->id}/refunds", [
            'amount' => 50,
            'reason' => 'Client requested refund.',
        ])->assertCreated()
            ->assertJsonPath('data.status', 'succeeded')
            ->assertJsonPath('data.provider_refund_id', '999');

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'refunded',
        ]);
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

    protected function createService(): Service
    {
        return Service::query()->create([
            'name' => 'Payment Care ' . uniqid(),
            'slug' => 'payment-care-' . uniqid(),
            'description' => 'Care service.',
            'price' => 200,
            'duration_minutes' => 120,
            'status' => 'active',
        ]);
    }

    protected function createBooking(Client $client, Service $service): Booking
    {
        $start = now()->addDays(3)->setTime(9, 0);

        return Booking::query()->create([
            'booking_number' => 'PAY-' . uniqid(),
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

    protected function createPayment(User $user, Booking $booking, array $overrides = []): Payment
    {
        return Payment::query()->create(array_merge([
            'booking_id' => $booking->id,
            'invoice_id' => null,
            'user_id' => $user->id,
            'provider' => 'paystack',
            'provider_payment_intent_id' => 'RG-PAY-' . uniqid(),
            'provider_charge_id' => null,
            'amount' => $booking->total_amount,
            'currency' => 'NGN',
            'status' => 'processing',
            'payment_type' => 'one_time',
            'metadata' => [],
        ], $overrides));
    }
}
