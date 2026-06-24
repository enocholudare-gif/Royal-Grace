<?php
$cookieFile = __DIR__ . '/cookie.txt';

$ch = curl_init('http://localhost:8000/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'admin@example.com',
    'password' => 'password'
]));
$response = curl_exec($ch);
curl_close($ch);
echo "Login Response:\n" . $response . "\n\n";

$ch2 = curl_init('http://localhost:8000/admin/dashboard');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_COOKIEJAR, $cookieFile);
curl_setopt($ch2, CURLOPT_COOKIEFILE, $cookieFile);
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
    'Accept: text/html'
]);
$response2 = curl_exec($ch2);
$httpcode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
$redirectUrl = curl_getinfo($ch2, CURLINFO_REDIRECT_URL);
curl_close($ch2);

echo "Dashboard Status: " . $httpcode . "\n";
if ($httpcode == 302 || $httpcode == 301) {
    echo "Dashboard Redirect: " . $redirectUrl . "\n";
} else {
    echo "Dashboard loaded correctly (Length: " . strlen($response2) . ")\n";
}
