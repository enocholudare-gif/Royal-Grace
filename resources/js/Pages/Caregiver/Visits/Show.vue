<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CaregiverLayout from '../../../Layouts/CaregiverLayout.vue';
import VisitStatusBadge from '../../../Components/Visits/VisitStatusBadge.vue';
import VisitTimeline from '../../../Components/Visits/VisitTimeline.vue';

defineOptions({ layout: CaregiverLayout });

const props = defineProps({
    booking: { type: Object, required: true },
});

const formatDateTime = (dt) => {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    });
};

const canCheckIn = (b) =>
    (b.status === 'confirmed' || b.status === 'scheduled') && !b.visit_report?.arrival_time;

const isActive = (b) =>
    b.status === 'in_progress' && b.visit_report?.arrival_time && !b.visit_report?.departure_time;
</script>

<template>
    <Head :title="`Visit – ${booking.client?.user?.name ?? 'Client'}`" />

    <div class="space-y-6">
        <!-- Back -->
        <Link href="/caregiver/visits" class="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Visits
        </Link>

        <!-- Header -->
        <div class="flex items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-text">{{ booking.client?.user?.name ?? 'Client Visit' }}</h1>
                <p class="mt-1 text-text-muted">{{ booking.service_name_snapshot ?? booking.service?.name ?? 'Care Service' }}</p>
            </div>
            <VisitStatusBadge :status="booking.visit_report?.status ?? booking.status" size="lg" />
        </div>

        <div class="grid gap-6 lg:grid-cols-[1fr_340px]">
            <!-- Main content -->
            <div class="space-y-5">
                <!-- Client Information -->
                <div class="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <h2 class="mb-4 text-sm font-semibold text-text-soft uppercase tracking-wide">Client Information</h2>
                    <div class="grid gap-3 sm:grid-cols-2">
                        <div>
                            <p class="text-xs text-text-soft">Full Name</p>
                            <p class="font-medium text-text">{{ booking.client?.user?.name ?? '—' }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-text-soft">Phone</p>
                            <p class="font-medium text-text">{{ booking.client?.user?.phone ?? '—' }}</p>
                        </div>
                        <div class="sm:col-span-2">
                            <p class="text-xs text-text-soft">Address</p>
                            <p class="font-medium text-text">{{ booking.client?.address ?? '—' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Service Information -->
                <div class="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <h2 class="mb-4 text-sm font-semibold text-text-soft uppercase tracking-wide">Service Information</h2>
                    <div class="grid gap-3 sm:grid-cols-2">
                        <div>
                            <p class="text-xs text-text-soft">Service Type</p>
                            <p class="font-medium text-text">{{ booking.service_name_snapshot ?? booking.service?.name }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-text-soft">Duration</p>
                            <p class="font-medium text-text">{{ booking.service_duration_snapshot ?? '—' }} mins</p>
                        </div>
                        <div>
                            <p class="text-xs text-text-soft">Scheduled Start</p>
                            <p class="font-medium text-text">{{ formatDateTime(booking.scheduled_start_at) }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-text-soft">Scheduled End</p>
                            <p class="font-medium text-text">{{ formatDateTime(booking.scheduled_end_at) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Care Instructions -->
                <div v-if="booking.care_instructions" class="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Care Instructions
                    </h2>
                    <p class="text-sm leading-relaxed text-amber-900">{{ booking.care_instructions }}</p>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-5">
                <!-- Timeline -->
                <VisitTimeline
                    :check-in-time="booking.visit_report?.arrival_time"
                    :check-out-time="booking.visit_report?.departure_time"
                />

                <!-- Action Button -->
                <div class="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <h2 class="mb-3 text-sm font-semibold text-text-soft uppercase tracking-wide">Actions</h2>

                    <Link
                        v-if="canCheckIn(booking)"
                        :href="`/caregiver/visits/${booking.id}/check-in`"
                        class="btn-primary w-full justify-center text-center"
                    >
                        <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        GPS Check-In
                    </Link>

                    <Link
                        v-else-if="isActive(booking)"
                        :href="`/caregiver/visits/${booking.id}/active`"
                        class="w-full justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-amber-600 transition block"
                    >
                        View Active Visit
                    </Link>

                    <p v-else class="text-sm text-text-muted">No actions available for this visit.</p>
                </div>
            </div>
        </div>
    </div>
</template>
