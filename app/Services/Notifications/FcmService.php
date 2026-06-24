<?php

namespace App\Services\Notifications;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class FcmService
{
    public function sendToUser(User $user, string $title, string $body, array $data = []): void
    {
        $tokens = $user->fcmTokens()->pluck('token')->all();

        if ($tokens === []) {
            return;
        }

        $serverKey = (string) config('services.fcm.server_key');

        if ($serverKey === '') {
            return;
        }

        $response = Http::withHeaders([
            'Authorization' => "key={$serverKey}",
            'Content-Type' => 'application/json',
        ])->post((string) config('services.fcm.endpoint'), [
            'registration_ids' => $tokens,
            'notification' => [
                'title' => $title,
                'body' => $body,
            ],
            'data' => $data,
            'priority' => 'high',
        ]);

        if ($response->failed()) {
            throw new RuntimeException($response->json('error') ?? 'FCM notification failed.');
        }

        $user->fcmTokens()->whereIn('token', $tokens)->update(['last_used_at' => now()]);
    }
}
