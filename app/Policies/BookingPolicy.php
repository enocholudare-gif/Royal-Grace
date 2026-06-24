<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('bookings.view')
            || $user->hasPermission('bookings.view.own')
            || $user->hasPermission('bookings.view.family')
            || $user->hasPermission('bookings.view.assigned');
    }

    public function view(User $user, Booking $booking): bool
    {
        if (in_array($user->role?->slug, ['super-admin', 'admin'], true)) {
            return true;
        }

        if ($user->role?->slug === 'client' && $user->client?->id === $booking->client_id) {
            return true;
        }

        if ($user->role?->slug === 'family-member' && $user->familyMember?->client_id === $booking->client_id) {
            return true;
        }

        return $user->role?->slug === 'caregiver' && $user->caregiver?->id === $booking->assigned_caregiver_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('bookings.manage')
            || $user->hasPermission('bookings.create');
    }

    public function update(User $user, Booking $booking): bool
    {
        if ($user->hasPermission('bookings.manage')) {
            return true;
        }

        return $user->hasPermission('bookings.manage.own')
            && $user->client?->id === $booking->client_id
            && in_array($booking->status, ['pending', 'awaiting_payment'], true);
    }

    public function delete(User $user, Booking $booking): bool
    {
        return $user->hasPermission('bookings.manage');
    }

    public function assign(User $user, Booking $booking): bool
    {
        return $user->hasPermission('bookings.assign');
    }

    public function confirm(User $user, Booking $booking): bool
    {
        return $user->hasPermission('bookings.manage');
    }

    public function updateStatus(User $user, Booking $booking): bool
    {
        if ($user->hasPermission('bookings.manage')) {
            return true;
        }

        return $user->hasPermission('visits.manage.assigned')
            && $user->caregiver?->id === $booking->assigned_caregiver_id
            && in_array($booking->status, ['assigned', 'in_progress'], true);
    }

    public function cancel(User $user, Booking $booking): bool
    {
        if ($user->hasPermission('bookings.manage')) {
            return true;
        }

        return $user->hasPermission('bookings.manage.own')
            && $user->client?->id === $booking->client_id
            && ! in_array($booking->status, ['completed', 'cancelled', 'refunded'], true);
    }

    public function checkIn(User $user, Booking $booking): bool
    {
        return $user->hasPermission('visits.manage.assigned')
            && $user->caregiver?->id === $booking->assigned_caregiver_id
            && in_array($booking->status, ['assigned', 'confirmed'], true);
    }

    public function checkOut(User $user, Booking $booking): bool
    {
        return $user->hasPermission('visits.manage.assigned')
            && $user->caregiver?->id === $booking->assigned_caregiver_id
            && $booking->status === 'in_progress';
    }
}
