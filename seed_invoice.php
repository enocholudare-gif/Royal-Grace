<?php
$user = \App\Models\User::where('email', 'client@example.com')->first();
if (!$user) {
    echo "User not found\n";
    exit;
}
$client = $user->client;
if(!$client) { 
    $client = \App\Models\Client::create([
        'user_id' => $user->id, 
        'address' => '123 Test St', 
        'city' => 'Test City', 
        'phone' => '1234567890'
    ]); 
} 
$booking = \App\Models\Booking::firstOrCreate(
    ['client_id' => $client->id, 'service_id' => 1], 
    [
        'status' => 'confirmed', 
        'total_price' => 150.00, 
        'scheduled_start_at' => now()->addDays(2), 
        'scheduled_end_at' => now()->addDays(2)->addHours(2)
    ]
); 
\App\Models\Invoice::create([
    'booking_id' => $booking->id, 
    'invoice_number' => 'INV-' . strtoupper(uniqid()), 
    'subtotal_amount' => 150.00,
    'tax_amount' => 0.00,
    'total_amount' => 150.00, 
    'status' => 'draft',
    'issue_date' => now(), 
    'due_date' => now()->addDays(7)
]); 
echo "Dummy Invoice created for client@example.com!\n";
