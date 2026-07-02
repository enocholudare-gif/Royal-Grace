<?php

$cookieFile = __DIR__ . '/cookie.txt';
if (file_exists($cookieFile)) {
    unlink($cookieFile);
}

// 1. Visit Login Page to get CSRF token and session cookie
$ch = curl_init('http://localhost:8000/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
$response = curl_exec($ch);
curl_close($ch);

// Parse CSRF token from page
preg_match('/"csrf-token" content="([^"]+)"/', $response, $matches);
$csrfToken = $matches[1] ?? '';
echo "Parsed CSRF Token: " . $csrfToken . "\n";

// 2. Perform Inertia POST login request
$ch2 = curl_init('http://localhost:8000/login');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_HEADER, true);
curl_setopt($ch2, CURLOPT_POST, true);
curl_setopt($ch2, CURLOPT_COOKIEJAR, $cookieFile);
curl_setopt($ch2, CURLOPT_COOKIEFILE, $cookieFile);
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'X-Inertia: true',
    'X-Inertia-Version: 8df20960b49490f21635e3c7946b7f59', // from built manifest
    'X-CSRF-TOKEN: ' . $csrfToken
]);
curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'admin@example.com',
    'password' => 'password',
    'device_name' => 'web'
]));
$response2 = curl_exec($ch2);
$httpcode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
curl_close($ch2);

echo "Inertia Login HTTP Code: " . $httpcode . "\n";
echo "Inertia Login Response Headers & Body:\n" . $response2 . "\n\n";
