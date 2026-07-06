<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Landing'))->name('home');

Route::middleware(['auth'])->get('/dashboard', function () {
    $role = auth()->user()->role_slug;
    
    if ($role === 'super-admin') {
        return redirect()->route('frontend.super-admin.dashboard');
    } elseif ($role === 'admin') {
        return redirect()->route('frontend.admin.dashboard');
    } elseif ($role === 'client') {
        return redirect()->route('frontend.client.dashboard');
    } elseif ($role === 'caregiver') {
        return redirect()->route('frontend.caregiver.dashboard');
    } elseif ($role === 'family-member') {
        return redirect()->route('frontend.family.dashboard');
    }
    
    return redirect('/');
})->name('dashboard');

require __DIR__.'/frontend_auth.php';
require __DIR__.'/frontend_dashboard.php';
require __DIR__.'/frontend_booking.php';
require __DIR__.'/frontend_api.php';
