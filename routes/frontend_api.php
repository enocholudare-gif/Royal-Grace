<?php

use App\Http\Controllers\BookingManagement\BookingController;
use App\Http\Controllers\FamilyPortal\FamilyPortalController;
use App\Http\Controllers\NotificationManagement\NotificationController;
use App\Http\Controllers\PaymentManagement\PaymentController;
use App\Http\Controllers\ServiceManagement\ServiceController;
use App\Http\Controllers\VisitManagement\VisitController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmailVerificationController;
use Illuminate\Support\Facades\Route;

// Guest Auth Routes
Route::middleware('guest')->group(function (): void {
    Route::post('/login', [AuthController::class, 'login'])->name('api.login');
    Route::post('/register', [AuthController::class, 'register'])->name('api.register');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('api.password.email');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('api.password.store');
    
    // Email Verification API Endpoint (for the frontend to hit)
    Route::get('/api/email/verify/{id}/{hash}', [EmailVerificationController::class, '__invoke'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('api.verification.verify');
});

Route::middleware('auth')->group(function (): void {
    // Authenticated Auth Routes
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

    // Dashboard Data Endpoints
    Route::get('/bookings', [BookingController::class, 'index'])->name('frontend.bookings.index');
    Route::get('/payments', [PaymentController::class, 'index'])->name('frontend.payments.index');
    Route::prefix('api/notifications')->name('frontend.notifications.')->group(function (): void {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/unread-count', [NotificationController::class, 'unreadCount'])->name('unread-count');
        Route::patch('/read', [NotificationController::class, 'markRead'])->name('mark-read');
        Route::patch('/read-all', [NotificationController::class, 'markAllRead'])->name('mark-all-read');
        Route::delete('/bulk', [NotificationController::class, 'bulkDestroy'])->name('bulk-destroy');
        Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
    });
    Route::get('/visits', [VisitController::class, 'index'])->name('frontend.visits.index');
    Route::get('/calendar/events', [\App\Http\Controllers\Calendar\CalendarController::class, 'index'])->name('frontend.calendar.events');

    // Family Portal Dashboard API Endpoints
    Route::middleware('role:family-member')->prefix('api/family')->name('api.family.')->group(function (): void {
        Route::get('/bookings', [FamilyPortalController::class, 'upcomingBookings'])->name('bookings.index');
        Route::get('/visits', [FamilyPortalController::class, 'completedVisits'])->name('visits.index');
        Route::get('/invoices', [FamilyPortalController::class, 'invoices'])->name('invoices.index');
        Route::get('/notifications', [FamilyPortalController::class, 'notifications'])->name('notifications.index');
    });

    // Services
    Route::get('/services', [ServiceController::class, 'index'])->name('frontend.services.index');
    Route::post('/services', [ServiceController::class, 'store'])->name('frontend.services.store');
    Route::get('/services/{service}', [ServiceController::class, 'show'])->name('frontend.services.show');
    Route::put('/services/{service}', [ServiceController::class, 'update'])->name('frontend.services.update');
    Route::patch('/services/{service}/disable', [ServiceController::class, 'disable'])->name('frontend.services.disable');
    Route::delete('/services/{service}', [ServiceController::class, 'destroy'])->name('frontend.services.destroy');

    // Bookings (Write)
    Route::post('/bookings', [BookingController::class, 'store'])->name('frontend.bookings.store');
    Route::put('/bookings/{booking}', [BookingController::class, 'update'])->name('frontend.bookings.update');

    // Caregivers
    Route::get('/caregivers', [\App\Http\Controllers\CaregiverManagement\CaregiverController::class, 'index'])->name('frontend.caregivers.index');
    Route::post('/caregivers', [\App\Http\Controllers\CaregiverManagement\CaregiverController::class, 'store'])->name('frontend.caregivers.store');
    Route::get('/caregivers/{caregiver}', [\App\Http\Controllers\CaregiverManagement\CaregiverController::class, 'show'])->name('frontend.caregivers.show');
    Route::put('/caregivers/{caregiver}', [\App\Http\Controllers\CaregiverManagement\CaregiverController::class, 'update'])->name('frontend.caregivers.update');
    Route::post('/caregivers/{caregiver}/attendance', [\App\Http\Controllers\CaregiverManagement\CaregiverController::class, 'recordAttendance'])->name('frontend.caregivers.attendance.store');
    Route::post('/caregivers/{caregiver}/availability', [\App\Http\Controllers\CaregiverManagement\CaregiverController::class, 'createAvailability'])->name('frontend.caregivers.availability.store');

    // Clients
    Route::get('/clients/search', [\App\Http\Controllers\ClientManagement\ClientController::class, 'index'])->name('frontend.clients.search');
    Route::get('/clients', [\App\Http\Controllers\ClientManagement\ClientController::class, 'index'])->name('frontend.clients.index');
    Route::post('/clients', [\App\Http\Controllers\ClientManagement\ClientController::class, 'store'])->name('frontend.clients.store');
    Route::get('/clients/{client}', [\App\Http\Controllers\ClientManagement\ClientController::class, 'show'])->name('frontend.clients.show');
    Route::put('/clients/{client}', [\App\Http\Controllers\ClientManagement\ClientController::class, 'update'])->name('frontend.clients.update');
    Route::delete('/clients/{client}', [\App\Http\Controllers\ClientManagement\ClientController::class, 'destroy'])->name('frontend.clients.destroy');
    Route::patch('/clients/{id}/restore', [\App\Http\Controllers\ClientManagement\ClientController::class, 'restore'])->name('frontend.clients.restore');
    Route::get('/clients/{client}/bookings', [\App\Http\Controllers\ClientManagement\ClientController::class, 'bookings'])->name('frontend.clients.bookings');
    Route::get('/clients/{client}/payments', [\App\Http\Controllers\ClientManagement\ClientController::class, 'payments'])->name('frontend.clients.payments');
    Route::get('/clients/{client}/visit-reports', [\App\Http\Controllers\ClientManagement\ClientController::class, 'visitReports'])->name('frontend.clients.visit-reports');
    Route::get('/clients/{client}/family-members', [\App\Http\Controllers\ClientManagement\ClientController::class, 'familyMembers'])->name('frontend.clients.family-members');
    Route::post('/clients/{client}/attachments', [\App\Http\Controllers\ClientManagement\ClientController::class, 'uploadAttachment'])->name('frontend.clients.attachments.store');

    // Payments (Write)
    Route::post('/payments/bookings/{booking}/initialize', [PaymentController::class, 'initializeBookingPayment'])->name('frontend.payments.booking.initialize');
    Route::post('/payments/verify', [PaymentController::class, 'verify'])->name('frontend.payments.verify');

    // Bank Transfer Admin Routes
    Route::middleware('role:admin,super-admin')->group(function () {
        Route::get('/admin/invoices/pending-transfers', function () {
            $invoices = \App\Models\Invoice::with(['booking.client.user'])
                ->where('status', 'pending_verification')
                ->where('payment_method', 'bank_transfer')
                ->orderBy('payment_submitted_at', 'asc')
                ->get();
            return response()->json($invoices);
        })->name('admin.invoices.pending-transfers');

        Route::post('/admin/invoices/{invoice}/approve-transfer', function (\App\Models\Invoice $invoice) {
            abort_unless($invoice->status === 'pending_verification', 422, 'Invoice is not pending verification.');
            $invoice->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);
            return response()->json(['message' => 'Invoice approved and marked as paid.']);
        })->name('admin.invoices.approve-transfer');
    });
    
    // Stripe Payments
    Route::post('/payments/intent', [\App\Http\Controllers\Api\PaymentController::class, 'intent'])->name('api.payments.intent');
    Route::post('/payments/confirm', [\App\Http\Controllers\Api\PaymentController::class, 'confirm'])->name('api.payments.confirm');

    // Messaging
    Route::prefix('messages')->name('frontend.messages.')->group(function (): void {
        Route::get('/conversations', [\App\Http\Controllers\Messaging\ConversationController::class, 'index'])->name('conversations.index');
        Route::post('/conversations', [\App\Http\Controllers\Messaging\ConversationController::class, 'store'])->name('conversations.store');
        Route::get('/conversations/{conversation}', [\App\Http\Controllers\Messaging\ConversationController::class, 'show'])->name('conversations.show');
        Route::patch('/conversations/{conversation}/read', [\App\Http\Controllers\Messaging\ConversationController::class, 'markRead'])->name('conversations.read');
        Route::get('/conversations/{conversation}/messages', [\App\Http\Controllers\Messaging\MessageController::class, 'index'])->name('history');
        Route::post('/conversations/{conversation}/messages', [\App\Http\Controllers\Messaging\MessageController::class, 'store'])->name('send');
    });

    // Reports
    Route::middleware('role:admin,super-admin')->prefix('reports')->name('frontend.reports.')->group(function (): void {
        Route::get('/dashboard', [\App\Http\Controllers\ReportManagement\ReportController::class, 'dashboard'])->name('dashboard');
        Route::get('/revenue', [\App\Http\Controllers\ReportManagement\ReportController::class, 'revenue'])->name('revenue');
        Route::get('/bookings', [\App\Http\Controllers\ReportManagement\ReportController::class, 'bookings'])->name('bookings');
        Route::get('/caregivers', [\App\Http\Controllers\ReportManagement\ReportController::class, 'caregivers'])->name('caregivers');
        Route::get('/clients', [\App\Http\Controllers\ReportManagement\ReportController::class, 'clients'])->name('clients');
        Route::post('/export/pdf', [\App\Http\Controllers\ReportManagement\ReportController::class, 'exportPdf'])->name('export.pdf');
        Route::post('/export/excel', [\App\Http\Controllers\ReportManagement\ReportController::class, 'exportExcel'])->name('export.excel');
    });

    // Ratings
    Route::prefix('ratings')->name('frontend.ratings.')->group(function (): void {
        Route::get('/', [\App\Http\Controllers\Ratings\RatingController::class, 'index'])->name('index');
        Route::get('/history', [\App\Http\Controllers\Ratings\RatingController::class, 'index'])->name('history'); // same controller logic
        Route::get('/statistics', [\App\Http\Controllers\Ratings\RatingController::class, 'statistics'])->name('statistics');
        Route::get('/{rating}', [\App\Http\Controllers\Ratings\RatingController::class, 'show'])->name('show');
        Route::post('/', [\App\Http\Controllers\Ratings\RatingController::class, 'store'])->name('store');
    });

    // Support Center
    Route::prefix('support')->name('frontend.support.')->group(function (): void {
        Route::get('/faq', [\App\Http\Controllers\API\Support\SupportController::class, 'faqs'])->name('faqs');
        Route::get('/', [\App\Http\Controllers\API\Support\SupportController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\API\Support\SupportController::class, 'store'])->name('store');
        Route::get('/{id}', [\App\Http\Controllers\API\Support\SupportController::class, 'show'])->name('show');
        Route::put('/{id}', [\App\Http\Controllers\API\Support\SupportController::class, 'update'])->name('update');
        Route::post('/{id}/reply', [\App\Http\Controllers\API\Support\SupportController::class, 'reply'])->name('reply');
    });
});
