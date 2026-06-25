<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import CaregiverLayout from '../../../Layouts/CaregiverLayout.vue';
import GPSLocationCard from '../../../Components/Visits/GPSLocationCard.vue';
import VisitTimeline from '../../../Components/Visits/VisitTimeline.vue';

defineOptions({ layout: CaregiverLayout });

const props = defineProps({
    booking: { type: Object, required: true },
    visitReport: { type: Object, required: true },
});

const gpsError = ref('');

const form = useForm({
    latitude: null,
    longitude: null,
    device_info: navigator?.userAgent ?? '',
});

const onCoordinates = ({ latitude, longitude }) => {
    form.latitude = latitude;
    form.longitude = longitude;
    gpsError.value = '';
};

const onPermissionDenied = () => {
    gpsError.value = 'Location permission is required for check-out. Please allow access.';
};

const handleCheckOut = () => {
    if (!form.latitude || !form.longitude) {
        gpsError.value = 'Please wait for your GPS location to be captured.';
        return;
    }
    form.post(`/caregiver/visits/${props.booking.id}/check-out`);
};

const formatTime = (dt) => {
    if (!dt) return '—';
    return new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
    <Head title="GPS Check-Out" />

    <div class="mx-auto max-w-xl space-y-6">
        <!-- Back -->
        <Link :href="`/caregiver/visits/${booking.id}/active`" class="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Active Visit
        </Link>

        <!-- Header -->
        <div class="text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100">
                <svg class="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-text">GPS Check-Out</h1>
            <p class="mt-1 text-sm text-text-muted">
                Confirm your location to complete the visit for
                <strong>{{ booking.client?.user?.name }}</strong>
            </p>
        </div>

        <!-- Timeline summary -->
        <VisitTimeline
            :check-in-time="visitReport?.arrival_time"
            :check-out-time="null"
        />

        <!-- Visit summary -->
        <div class="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p class="text-xs text-text-soft">Service</p>
                    <p class="font-medium text-text">{{ booking.service_name_snapshot ?? '—' }}</p>
                </div>
                <div>
                    <p class="text-xs text-text-soft">Checked In</p>
                    <p class="font-medium text-text">{{ formatTime(visitReport?.arrival_time) }}</p>
                </div>
            </div>
        </div>

        <!-- GPS Card -->
        <GPSLocationCard
            label="Your Check-Out Location"
            :auto-capture="true"
            @coordinates="onCoordinates"
            @permission-denied="onPermissionDenied"
        />

        <!-- GPS error -->
        <div v-if="gpsError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ gpsError }}
        </div>

        <!-- Form errors -->
        <div v-if="form.errors.latitude" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ form.errors.latitude }}
        </div>

        <!-- Confirm -->
        <button
            type="button"
            class="w-full rounded-xl bg-rose-600 px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50"
            :disabled="form.processing || !form.latitude"
            @click="handleCheckOut"
        >
            <span v-if="form.processing" class="inline-flex items-center gap-2">
                <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
            </span>
            <span v-else>Confirm Check-Out</span>
        </button>

        <p class="text-center text-xs text-text-muted">
            After check-out, you'll be redirected to submit your visit report.
        </p>
    </div>
</template>
