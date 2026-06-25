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
    Route::get('/notifications', [NotificationController::class, 'index'])->name('frontend.notifications.index');
    Route::get('/visits', [VisitController::class, 'index'])->name('frontend.visits.index');
    Route::get('/calendar/events', [\App\Http\Controllers\Calendar\CalendarController::class, 'index'])->name('frontend.calendar.events');

    // Family Portal Dashboard Endpoints
    Route::prefix('family')->name('frontend.family.')->group(function (): void {
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

    // Payments (Write)
    Route::post('/payments/bookings/{booking}/initialize', [PaymentController::class, 'initializeBookingPayment'])->name('frontend.payments.booking.initialize');
    Route::post('/payments/verify', [PaymentController::class, 'verify'])->name('frontend.payments.verify');

    // Messaging
    Route::prefix('messages')->name('frontend.messages.')->group(function (): void {
        Route::get('/conversations', [\App\Http\Controllers\Messaging\ConversationController::class, 'index'])->name('conversations.index');
        Route::post('/conversations', [\App\Http\Controllers\Messaging\ConversationController::class, 'store'])->name('conversations.store');
        Route::get('/conversations/{conversation}', [\App\Http\Controllers\Messaging\ConversationController::class, 'show'])->name('conversations.show');
        Route::patch('/conversations/{conversation}/read', [\App\Http\Controllers\Messaging\ConversationController::class, 'markRead'])->name('conversations.read');
        Route::get('/conversations/{conversation}/messages', [\App\Http\Controllers\Messaging\MessageController::class, 'index'])->name('history');
        Route::post('/conversations/{conversation}/messages', [\App\Http\Controllers\Messaging\MessageController::class, 'store'])->name('send');
    });
});
