<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

require __DIR__.'/frontend_auth.php';
require __DIR__.'/frontend_dashboard.php';
require __DIR__.'/frontend_booking.php';
require __DIR__.'/frontend_api.php';
