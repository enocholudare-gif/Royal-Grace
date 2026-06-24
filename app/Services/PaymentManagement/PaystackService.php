<?php

namespace App\Services\PaymentManagement;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class PaystackService
{
    public function initializeTransaction(array $payload): array
    {
        return $this->post('/transaction/initialize', $payload);
    }

    public function verifyTransaction(string $reference): array
    {
        return $this->get("/transaction/verify/{$reference}");
    }

    public function createRefund(array $payload): array
    {
        return $this->post('/refund', $payload);
    }

    public function isValidWebhookSignature(string $payload, ?string $signature): bool
    {
        $secret = (string) config('services.paystack.secret_key');

        if ($secret === '' || ! $signature) {
            return false;
        }

        return hash_equals(hash_hmac('sha512', $payload, $secret), $signature);
    }

    protected function post(string $uri, array $payload): array
    {
        try {
            $response = Http::withToken((string) config('services.paystack.secret_key'))
                ->acceptJson()
                ->post($this->baseUrl() . $uri, $payload);
        } catch (ConnectionException $exception) {
            throw new RuntimeException('Unable to connect to Paystack.', previous: $exception);
        }

        if ($response->failed()) {
            throw new RuntimeException($response->json('message') ?? 'Paystack request failed.');
        }

        return $response->json();
    }

    protected function get(string $uri): array
    {
        try {
            $response = Http::withToken((string) config('services.paystack.secret_key'))
                ->acceptJson()
                ->get($this->baseUrl() . $uri);
        } catch (ConnectionException $exception) {
            throw new RuntimeException('Unable to connect to Paystack.', previous: $exception);
        }

        if ($response->failed()) {
            throw new RuntimeException($response->json('message') ?? 'Paystack request failed.');
        }

        return $response->json();
    }

    protected function baseUrl(): string
    {
        return rtrim((string) config('services.paystack.base_url'), '/');
    }
}
