<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import CaregiverLayout from '../../../Layouts/CaregiverLayout.vue';
import GPSLocationCard from '../../../Components/Visits/GPSLocationCard.vue';

defineOptions({ layout: CaregiverLayout });

const props = defineProps({
    booking: { type: Object, required: true },
});

const gpsRef = ref(null);
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
    gpsError.value = 'Location permission is required to check in. Please allow location access and try again.';
};

const handleCheckIn = () => {
    if (!form.latitude || !form.longitude) {
        gpsError.value = 'Please wait for your GPS location to be captured before confirming.';
        return;
    }
    form.post(`/caregiver/visits/${props.booking.id}/check-in`);
};
</script>

<template>
    <Head title="GPS Check-In" />

    <div class="mx-auto max-w-xl space-y-6">
        <!-- Back -->
        <Link :href="`/caregiver/visits/${booking.id}`" class="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Visit Details
        </Link>

        <!-- Header -->
        <div class="text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
                <svg class="h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-text">GPS Check-In</h1>
            <p class="mt-1 text-sm text-text-muted">
                Confirm your location to start the visit for
                <strong>{{ booking.client?.user?.name }}</strong>
            </p>
        </div>

        <!-- Visit summary card -->
        <div class="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p class="text-xs text-text-soft">Service</p>
                    <p class="font-medium text-text">{{ booking.service_name_snapshot ?? booking.service?.name }}</p>
                </div>
                <div>
                    <p class="text-xs text-text-soft">Scheduled</p>
                    <p class="font-medium text-text">
                        {{ new Date(booking.scheduled_start_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }}
                    </p>
                </div>
            </div>
        </div>

        <!-- GPS Card -->
        <GPSLocationCard
            ref="gpsRef"
            label="Your Check-In Location"
            :auto-capture="true"
            @coordinates="onCoordinates"
            @permission-denied="onPermissionDenied"
        />

        <!-- GPS error -->
        <div v-if="gpsError" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {{ gpsError }}
        </div>

        <!-- Form errors -->
        <div v-if="form.errors.latitude || form.errors.longitude" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {{ form.errors.latitude || form.errors.longitude }}
        </div>

        <!-- Confirm button -->
        <button
            type="button"
            class="btn-primary w-full justify-center py-3 text-base"
            :disabled="form.processing || !form.latitude"
            @click="handleCheckIn"
        >
            <svg v-if="form.processing" class="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ form.processing ? 'Confirming…' : 'Confirm Check-In' }}
        </button>

        <!-- Note -->
        <p class="text-center text-xs text-text-muted">
            Your GPS coordinates and timestamp will be recorded for this visit.
        </p>
    </div>
</template>
