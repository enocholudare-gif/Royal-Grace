<?php
$ch = curl_init('http://127.0.0.1:8000/debug-session');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);
echo $response;
