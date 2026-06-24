<?php

namespace App\Providers;

use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\BookingNote;
use App\Models\Caregiver;
use App\Models\Client;
use App\Models\Conversation;
use App\Models\FamilyMember;
use App\Models\Invoice;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Rating;
use App\Models\Refund;
use App\Models\Role;
use App\Models\Service;
use App\Models\Setting;
use App\Models\SupportTicket;
use App\Models\User;
use App\Models\VisitReport;
use App\Policies\AuditLogPolicy;
use App\Policies\BookingNotePolicy;
use App\Policies\BookingPolicy;
use App\Policies\CaregiverPolicy;
use App\Policies\ClientPolicy;
use App\Policies\ConversationPolicy;
use App\Policies\FamilyMemberPolicy;
use App\Policies\InvoicePolicy;
use App\Policies\MessagePolicy;
use App\Policies\NotificationPolicy;
use App\Policies\PaymentPolicy;
use App\Policies\RatingPolicy;
use App\Policies\RefundPolicy;
use App\Policies\RolePolicy;
use App\Policies\ServicePolicy;
use App\Policies\SettingPolicy;
use App\Policies\SupportTicketPolicy;
use App\Policies\UserPolicy;
use App\Policies\VisitReportPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        Role::class => RolePolicy::class,
        Client::class => ClientPolicy::class,
        FamilyMember::class => FamilyMemberPolicy::class,
        Caregiver::class => CaregiverPolicy::class,
        Service::class => ServicePolicy::class,
        Booking::class => BookingPolicy::class,
        BookingNote::class => BookingNotePolicy::class,
        Payment::class => PaymentPolicy::class,
        Invoice::class => InvoicePolicy::class,
        Refund::class => RefundPolicy::class,
        VisitReport::class => VisitReportPolicy::class,
        Conversation::class => ConversationPolicy::class,
        Message::class => MessagePolicy::class,
        Notification::class => NotificationPolicy::class,
        Rating::class => RatingPolicy::class,
        SupportTicket::class => SupportTicketPolicy::class,
        AuditLog::class => AuditLogPolicy::class,
        Setting::class => SettingPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
