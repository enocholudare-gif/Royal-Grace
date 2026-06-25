<script setup>
import { Link } from '@inertiajs/vue3';
import VisitStatusBadge from './VisitStatusBadge.vue';

const props = defineProps({
    booking: { type: Object, required: true },
    showActions: { type: Boolean, default: true },
});

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
};

const formatTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit',
    });
};

const clientName = (booking) =>
    booking.client?.user?.name ?? 'Unknown Client';

const serviceType = (booking) =>
    booking.service_name_snapshot ?? booking.service?.name ?? 'General Care';

const address = (booking) =>
    booking.client?.address ?? booking.client?.user?.address ?? 'Address on file';

const visitStatus = (booking) => {
    if (booking.visit_report?.status === 'submitted') return 'submitted';
    if (booking.visit_report?.status === 'reviewed') return 'reviewed';
    return booking.status ?? 'scheduled';
};

const canCheckIn = (booking) => {
    const status = booking.status;
    return (status === 'confirmed' || status === 'scheduled') && !booking.visit_report?.arrival_time;
};

const isActive = (booking) =>
    booking.status === 'in_progress' && booking.visit_report?.arrival_time && !booking.visit_report?.departure_time;

const canCheckOut = (booking) =>
    isActive(booking);

const canSubmitReport = (booking) =>
    booking.visit_report?.departure_time && booking.visit_report?.status === 'draft';
</script>

<template>
    <div class="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:border-brand-300 hover:shadow-md">
        <!-- Header -->
        <div class="mb-4 flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
                <h3 class="truncate text-base font-semibold text-text">{{ clientName(booking) }}</h3>
                <p class="mt-0.5 text-sm text-text-muted">{{ serviceType(booking) }}</p>
            </div>
            <VisitStatusBadge :status="visitStatus(booking)" />
        </div>

        <!-- Details grid -->
        <div class="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-start gap-2">
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-text-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-text-muted">{{ formatDate(booking.scheduled_start_at) }}</span>
            </div>
            <div class="flex items-start gap-2">
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-text-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-text-muted">{{ formatTime(booking.scheduled_start_at) }} – {{ formatTime(booking.scheduled_end_at) }}</span>
            </div>
            <div class="col-span-2 flex items-start gap-2">
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-text-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-text-muted line-clamp-1">{{ address(booking) }}</span>
            </div>
        </div>

        <!-- Actions -->
        <div v-if="showActions" class="flex flex-wrap gap-2 border-t border-border pt-4">
            <Link
                :href="`/caregiver/visits/${booking.id}`"
                class="btn-secondary btn-sm flex-1"
            >
                View Details
            </Link>

            <Link
                v-if="canCheckIn(booking)"
                :href="`/caregiver/visits/${booking.id}/check-in`"
                class="btn-primary btn-sm flex-1"
            >
                Start Visit
            </Link>

            <Link
                v-else-if="isActive(booking)"
                :href="`/caregiver/visits/${booking.id}/active`"
                class="btn-sm flex-1 bg-amber-500 text-white hover:bg-amber-600"
            >
                Active Visit ▶
            </Link>

            <Link
                v-if="canCheckOut(booking)"
                :href="`/caregiver/visits/${booking.id}/check-out`"
                class="btn-sm flex-1 bg-rose-500 text-white hover:bg-rose-600"
            >
                Check Out
            </Link>

            <Link
                v-if="canSubmitReport(booking)"
                :href="`/caregiver/visits/reports/${booking.visit_report?.id}`"
                class="btn-sm flex-1 bg-teal-600 text-white hover:bg-teal-700"
            >
                Submit Report
            </Link>
        </div>
    </div>
</template>
