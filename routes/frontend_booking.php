<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function (): void {
    Route::get('/client/bookings/create', fn () => Inertia::render('Bookings/CreateBooking'))->name('frontend.bookings.create');
});
