<?php

use App\Http\Controllers\Caregiver\CaregiverVisitController;
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

    // Caregiver Visit Management
    Route::prefix('caregiver/visits')->name('caregiver.visits.')->group(function () {
        Route::get('/', [CaregiverVisitController::class, 'index'])->name('index');
        Route::get('/reports/{visitReport}', [CaregiverVisitController::class, 'reportForm'])->name('report');
        Route::post('/reports/{visitReport}', [CaregiverVisitController::class, 'storeReport'])->name('report.store');
        Route::get('/{booking}', [CaregiverVisitController::class, 'show'])->name('show');
        Route::get('/{booking}/check-in', [CaregiverVisitController::class, 'checkInForm'])->name('check-in');
        Route::post('/{booking}/check-in', [CaregiverVisitController::class, 'storeCheckIn'])->name('check-in.store');
        Route::get('/{booking}/active', [CaregiverVisitController::class, 'active'])->name('active');
        Route::get('/{booking}/check-out', [\App\Http\Controllers\Caregiver\CaregiverVisitController::class, 'checkOutForm'])->name('check-out');
        Route::post('/{booking}/check-out', [\App\Http\Controllers\Caregiver\CaregiverVisitController::class, 'storeCheckOut'])->name('check-out.store');
    });

    // Unified Messaging Interface
    Route::get('/messages', fn () => Inertia::render('Messaging/Index'))->name('frontend.messages');
});

