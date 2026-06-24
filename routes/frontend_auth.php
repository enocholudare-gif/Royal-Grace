<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function (): void {
    Route::get('/login', fn () => Inertia::render('Auth/Login'))->name('login');
    Route::get('/register', fn () => Inertia::render('Auth/Register'))->name('register');
    Route::get('/forgot-password', fn () => Inertia::render('Auth/ForgotPassword'))->name('password.request');
    Route::get('/reset-password', fn () => Inertia::render('Auth/ResetPassword'))->name('password.reset');
});

Route::get('/email/verify', fn () => Inertia::render('Auth/VerifyEmail'))->name('verification.notice');
