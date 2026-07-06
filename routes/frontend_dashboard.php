<?php

use App\Http\Controllers\Caregiver\CaregiverVisitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function (): void {
    // Unified Notification Center
    Route::get('/notifications', fn () => Inertia::render('Notifications/Index'))->name('frontend.notifications');

    Route::middleware('role:admin,super-admin')->group(function (): void {
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

        // Additional Admin Routes
        Route::get('/admin/bookings', fn () => Inertia::render('Admin/Bookings/Index'))->name('frontend.admin.bookings');
        // Admin Client Management
        Route::get('/admin/clients', fn () => Inertia::render('Admin/Clients/Index'))->name('frontend.admin.clients.index');
        Route::get('/admin/clients/create', fn () => Inertia::render('Admin/Clients/Create'))->name('frontend.admin.clients.create');
        Route::get('/admin/clients/{client}', fn ($client) => Inertia::render('Admin/Clients/Show', ['client' => \App\Models\Client::with(['user', 'familyMembers', 'bookings.service', 'ratings', 'attachments'])->findOrFail($client)]))->name('frontend.admin.clients.show');
        Route::get('/admin/clients/{client}/edit', fn ($client) => Inertia::render('Admin/Clients/Edit', ['client' => \App\Models\Client::with('user')->findOrFail($client)]))->name('frontend.admin.clients.edit');
        Route::get('/admin/payments', fn () => Inertia::render('Admin/Payments/Index'))->name('frontend.admin.payments');
        Route::get('/admin/reports', fn () => Inertia::render('Admin/Reports/Index'))->name('frontend.admin.reports');
        Route::get('/admin/ratings', fn () => Inertia::render('Admin/Ratings/Index'))->name('frontend.admin.ratings');
        Route::get('/admin/support', fn () => Inertia::render('Admin/Support/Index'))->name('frontend.admin.support');
        Route::get('/admin/support/{ticket}', fn ($ticket) => Inertia::render('Shared/Support/Show', ['ticketId' => $ticket]))->name('frontend.admin.support.show');
        
        // Bank Accounts
        Route::get('/admin/bank-accounts', [\App\Http\Controllers\Admin\BankAccountController::class, 'index'])->name('frontend.admin.bank-accounts.index');
        Route::post('/admin/bank-accounts', [\App\Http\Controllers\Admin\BankAccountController::class, 'store'])->name('frontend.admin.bank-accounts.store');
        Route::put('/admin/bank-accounts/{bankAccount}', [\App\Http\Controllers\Admin\BankAccountController::class, 'update'])->name('frontend.admin.bank-accounts.update');
        Route::delete('/admin/bank-accounts/{bankAccount}', [\App\Http\Controllers\Admin\BankAccountController::class, 'destroy'])->name('frontend.admin.bank-accounts.destroy');

        // Admin Payments
        Route::get('/admin/payments/pending', [\App\Http\Controllers\Admin\PaymentApprovalController::class, 'index'])->name('frontend.admin.payments.pending');
        Route::get('/admin/payments/{submission}', [\App\Http\Controllers\Admin\PaymentApprovalController::class, 'show'])->name('frontend.admin.payments.show');
        Route::post('/admin/payments/{submission}/approve', [\App\Http\Controllers\Admin\PaymentApprovalController::class, 'approve'])->name('frontend.admin.payments.approve');
        Route::post('/admin/payments/{submission}/reject', [\App\Http\Controllers\Admin\PaymentApprovalController::class, 'reject'])->name('frontend.admin.payments.reject');
        Route::get('/admin/payments/{submission}/receipt', [\App\Http\Controllers\Admin\PaymentApprovalController::class, 'downloadReceipt'])->name('frontend.admin.payments.download-receipt');
    });

    // Super Admin Only Routes
    Route::middleware('role:super-admin')->group(function (): void {
        Route::get('/super-admin/dashboard', fn () => Inertia::render('Dashboard/SuperAdminDashboard'))->name('frontend.super-admin.dashboard');
        Route::get('/super-admin/admins', [\App\Http\Controllers\SuperAdmin\AdminManagementController::class, 'index'])->name('frontend.super-admin.admins.index');
        Route::post('/super-admin/admins', [\App\Http\Controllers\SuperAdmin\AdminManagementController::class, 'store'])->name('frontend.super-admin.admins.store');
        Route::put('/super-admin/admins/{user}', [\App\Http\Controllers\SuperAdmin\AdminManagementController::class, 'update'])->name('frontend.super-admin.admins.update');
        Route::delete('/super-admin/admins/{user}', [\App\Http\Controllers\SuperAdmin\AdminManagementController::class, 'destroy'])->name('frontend.super-admin.admins.destroy');

        Route::get('/super-admin/settings', [\App\Http\Controllers\SuperAdmin\PlatformSettingController::class, 'index'])->name('frontend.super-admin.settings.index');
        Route::post('/super-admin/settings', [\App\Http\Controllers\SuperAdmin\PlatformSettingController::class, 'store'])->name('frontend.super-admin.settings.store');
    });

    Route::middleware('role:caregiver')->group(function () {
        Route::get('/caregiver/dashboard', fn () => Inertia::render('Dashboard/CaregiverDashboard'))->name('frontend.caregiver.dashboard');
        
        // Caregiver General Portal Routes
        Route::prefix('caregiver')->name('frontend.caregiver.')->group(function () {
            Route::get('/schedule', [\App\Http\Controllers\Caregiver\CaregiverPortalController::class, 'schedule'])->name('schedule');
            Route::get('/attendance', [\App\Http\Controllers\Caregiver\CaregiverPortalController::class, 'attendance'])->name('attendance');
        });

        // Caregiver Visit Management
        Route::prefix('caregiver/visits')->name('caregiver.visits.')->group(function () {
            Route::get('/', [CaregiverVisitController::class, 'index'])->name('index');
            Route::get('/reports/{visitReport}', [CaregiverVisitController::class, 'reportForm'])->name('report');
            Route::post('/reports/{visitReport}', [CaregiverVisitController::class, 'storeReport'])->name('report.store');
            Route::get('/{booking}', [CaregiverVisitController::class, 'show'])->name('show');
            Route::get('/{booking}/check-in', [CaregiverVisitController::class, 'checkInForm'])->name('check-in');
            Route::post('/{booking}/check-in', [CaregiverVisitController::class, 'storeCheckIn'])->name('check-in.store');
            Route::get('/{booking}/active', [CaregiverVisitController::class, 'active'])->name('active');
            Route::get('/{booking}/check-out', [CaregiverVisitController::class, 'checkOutForm'])->name('check-out');
            Route::post('/{booking}/check-out', [CaregiverVisitController::class, 'storeCheckOut'])->name('check-out.store');
        });
    });

    // Client Portal Routes
    Route::middleware('role:client')->prefix('client')->name('frontend.client.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\ClientPortal\ClientPortalController::class, 'dashboard'])->name('dashboard');
        Route::get('/bookings', [\App\Http\Controllers\ClientPortal\ClientPortalController::class, 'bookings'])->name('bookings');
        Route::post('/bookings', [\App\Http\Controllers\Client\BookingController::class, 'store'])->name('bookings.store');
        Route::get('/services', [\App\Http\Controllers\ClientPortal\ClientPortalController::class, 'services'])->name('services');
        Route::post('/services/request', [\App\Http\Controllers\ClientPortal\ClientPortalController::class, 'storeServiceRequest'])->name('services.request');
        Route::get('/bookings/{booking}/pay', function (\App\Models\Booking $booking) {
            $booking->load('service');
            return Inertia::render('Client/Bookings/Pay', ['booking' => $booking]);
        })->name('bookings.pay');
        Route::get('/invoices', [\App\Http\Controllers\Client\InvoiceController::class, 'index'])->name('invoices.index');
        Route::get('/invoices/{invoice}/pay', [\App\Http\Controllers\Client\PaymentController::class, 'makePayment'])->name('invoices.pay');
        Route::get('/invoices/{invoice}/download', [\App\Http\Controllers\Client\PaymentController::class, 'downloadInvoice'])->name('invoices.download');
        Route::post('/invoices/{invoice}/submit-receipt', [\App\Http\Controllers\Client\PaymentController::class, 'submitReceipt'])->name('invoices.submit-receipt');
        Route::get('/reports', [\App\Http\Controllers\ClientPortal\ClientPortalController::class, 'reports'])->name('reports');
        Route::get('/ratings', fn () => Inertia::render('Client/Ratings/History'))->name('ratings.history');
        Route::get('/ratings/submit/{booking}', function (\App\Models\Booking $booking) {
            $booking->load('service', 'assignedCaregiver.user');
            return Inertia::render('Client/Ratings/Submit', ['booking' => $booking]);
        })->name('ratings.submit');
    });

    Route::middleware('role:family-member')->prefix('family')->name('frontend.family.')->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('Dashboard/FamilyDashboard'))->name('dashboard');
        Route::get('/bookings', fn () => Inertia::render('Family/Bookings/Index'))->name('bookings');
        Route::get('/reports', fn () => Inertia::render('Family/Visits/Index'))->name('reports.index');
        Route::get('/reports/{visitReport}', function (\App\Models\VisitReport $visitReport) {
            $visitReport->load(['caregiver.user', 'booking.service']);
            return Inertia::render('Family/Visits/Show', ['report' => $visitReport]);
        })->name('reports.show');
        Route::get('/invoices', fn () => Inertia::render('Family/Invoices/Index'))->name('invoices');
        Route::get('/notifications', fn () => Inertia::render('Family/Notifications/Index'))->name('notifications');
        Route::get('/messages', fn () => Inertia::render('Messaging/Index'))->name('messages');
        Route::get('/ratings', fn () => Inertia::render('Family/Ratings/History'))->name('ratings.history');
        Route::get('/ratings/submit/{booking}', function (\App\Models\Booking $booking) {
            $booking->load('service', 'assignedCaregiver.user');
            return Inertia::render('Family/Ratings/Submit', ['booking' => $booking]);
        })->name('ratings.submit');
        Route::get('/profile', fn () => Inertia::render('Family/Profile/Edit'))->name('profile');
    });
    // Caregiver General Portal Routes
    Route::prefix('caregiver')->name('frontend.caregiver.')->group(function () {
        Route::get('/schedule', [\App\Http\Controllers\Caregiver\CaregiverPortalController::class, 'schedule'])->name('schedule');
        Route::get('/attendance', [\App\Http\Controllers\Caregiver\CaregiverPortalController::class, 'attendance'])->name('attendance');
    });

    // Caregiver Visit Management
    Route::prefix('caregiver/visits')->name('caregiver.visits.')->group(function () {
        Route::get('/', [CaregiverVisitController::class, 'index'])->name('index');
        Route::get('/reports/{visitReport}', [CaregiverVisitController::class, 'reportForm'])->name('report');
        Route::post('/reports/{visitReport}', [CaregiverVisitController::class, 'storeReport'])->name('report.store');
        Route::get('/{booking}', [CaregiverVisitController::class, 'show'])->name('show');
        Route::get('/{booking}/check-in', [CaregiverVisitController::class, 'checkInForm'])->name('check-in');
        Route::post('/{booking}/check-in', [CaregiverVisitController::class, 'storeCheckIn'])->name('check-in.store');
        Route::get('/{booking}/active', [CaregiverVisitController::class, 'active'])->name('active');
        Route::get('/{booking}/check-out', [CaregiverVisitController::class, 'checkOutForm'])->name('check-out');
        Route::post('/{booking}/check-out', [CaregiverVisitController::class, 'storeCheckOut'])->name('check-out.store');
    });

    // Unified Messaging Interface
    Route::get('/messages', fn () => Inertia::render('Messaging/Index'))->name('frontend.messages');

    // Shared Support Center
    Route::prefix('support')->name('frontend.support.')->group(function (): void {
        Route::get('/', fn () => Inertia::render('Shared/Support/Dashboard'))->name('dashboard');
        Route::get('/create', fn () => Inertia::render('Shared/Support/Create'))->name('create');
        Route::get('/faq', fn () => Inertia::render('Shared/Support/Faq'))->name('faq');
        Route::get('/{ticket}', fn ($ticket) => Inertia::render('Shared/Support/Show', ['ticketId' => $ticket]))->name('show');
    });
});

