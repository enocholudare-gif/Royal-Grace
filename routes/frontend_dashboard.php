<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function (): void {
    Route::get('/admin/dashboard', fn () => Inertia::render('Dashboard/AdminDashboard'))->name('frontend.admin.dashboard');
    
    // Admin Services Management
    Route::get('/admin/services', fn () => Inertia::render('Admin/Services/Index'))->name('frontend.admin.services.index');
    Route::get('/admin/services/create', fn () => Inertia::render('Admin/Services/Create'))->name('frontend.admin.services.create');
    Route::get('/admin/services/{service}', fn ($service) => Inertia::render('Admin/Services/Show', ['service' => \App\Models\Service::findOrFail($service)]))->name('frontend.admin.services.show');
    Route::get('/admin/services/{service}/edit', fn ($service) => Inertia::render('Admin/Services/Edit', ['service' => \App\Models\Service::findOrFail($service)]))->name('frontend.admin.services.edit');

    // Admin Caregiver Management
    Route::get('/admin/caregivers', fn () => Inertia::render('Admin/Caregivers/Index'))->name('frontend.admin.caregivers.index');
    Route::get('/admin/caregivers/create', fn () => Inertia::render('Admin/Caregivers/Create'))->name('frontend.admin.caregivers.create');
    Route::get('/admin/caregivers/{caregiver}', fn ($caregiver) => Inertia::render('Admin/Caregivers/Show', ['caregiver' => \App\Models\Caregiver::findOrFail($caregiver)]))->name('frontend.admin.caregivers.show');
    Route::get('/admin/caregivers/{caregiver}/edit', fn ($caregiver) => Inertia::render('Admin/Caregivers/Edit', ['caregiver' => \App\Models\Caregiver::findOrFail($caregiver)]))->name('frontend.admin.caregivers.edit');
    Route::get('/admin/caregivers/{caregiver}/availability', fn ($caregiver) => Inertia::render('Admin/Caregivers/Availability', ['caregiver' => \App\Models\Caregiver::findOrFail($caregiver)]))->name('frontend.admin.caregivers.availability');
    Route::get('/admin/caregivers/{caregiver}/attendance', fn ($caregiver) => Inertia::render('Admin/Caregivers/Attendance', ['caregiver' => \App\Models\Caregiver::findOrFail($caregiver)]))->name('frontend.admin.caregivers.attendance');

    // Admin Calendar
    Route::get('/admin/calendar', fn () => Inertia::render('Admin/Calendar/Index'))->name('frontend.admin.calendar');

    Route::get('/caregiver/dashboard', fn () => Inertia::render('Dashboard/CaregiverDashboard'))->name('frontend.caregiver.dashboard');
    Route::get('/client/dashboard', fn () => Inertia::render('Dashboard/ClientDashboard'))->name('frontend.client.dashboard');
    Route::get('/family/dashboard', fn () => Inertia::render('Dashboard/FamilyDashboard'))->name('frontend.family.dashboard');
});
