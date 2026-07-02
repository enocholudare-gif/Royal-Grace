<?php
$client = App\Models\User::whereHas('client')->first()->client;
$service = App\Models\Service::first();
$caregiver = App\Models\Caregiver::first();
App\Models\Booking::create([
    'booking_number' => 'BKG-' . time(),
    'client_id' => $client->id,
    'service_id' => $service->id,
    'service_name_snapshot' => $service->name,
    'service_price_snapshot' => $service->price ?? 100,
    'service_duration_snapshot' => 60,
    'assigned_caregiver_id' => $caregiver->id,
    'scheduled_start_at' => now()->subDays(2),
    'scheduled_end_at' => now()->subDays(2)->addHours(4),
    'status' => 'completed',
    'total_amount' => 100,
    'subtotal_amount' => 100
]);
echo "Booking created";
