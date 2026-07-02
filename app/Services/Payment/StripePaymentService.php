<?php

namespace App\Services\Payment;

use Stripe\StripeClient;
use Stripe\PaymentIntent;

class StripePaymentService
{
    protected StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(env('STRIPE_SECRET'));
    }

    public function createPaymentIntent(float $amount, string $currency = 'usd', array $metadata = []): PaymentIntent
    {
        return $this->stripe->paymentIntents->create([
            // Stripe expects amount in cents
            'amount' => (int) round($amount * 100),
            'currency' => $currency,
            'metadata' => $metadata,
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ]);
    }

    public function retrievePaymentIntent(string $intentId): PaymentIntent
    {
        return $this->stripe->paymentIntents->retrieve($intentId);
    }
}
