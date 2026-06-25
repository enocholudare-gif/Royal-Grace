<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['coordinates', 'error', 'permission-denied']);

const props = defineProps({
    label: { type: String, default: 'Current Location' },
    autoCapture: { type: Boolean, default: true },
});

const state = ref('idle'); // idle | requesting | success | error | denied
const coords = ref(null);
const accuracy = ref(null);
const capturedAt = ref(null);
const errorMessage = ref('');

let watchId = null;

const captureLocation = () => {
    if (!navigator.geolocation) {
        state.value = 'error';
        errorMessage.value = 'Geolocation is not supported by your browser.';
        emit('error', errorMessage.value);
        return;
    }

    state.value = 'requesting';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            coords.value = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            accuracy.value = Math.round(position.coords.accuracy);
            capturedAt.value = new Date();
            state.value = 'success';
            emit('coordinates', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
            });
        },
        (err) => {
            if (err.code === err.PERMISSION_DENIED) {
                state.value = 'denied';
                errorMessage.value = 'Location permission was denied. Please enable location access in your browser settings.';
                emit('permission-denied');
            } else {
                state.value = 'error';
                errorMessage.value = 'Unable to retrieve your location. Please try again.';
                emit('error', errorMessage.value);
            }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
};

const formatCoord = (val) => {
    if (val == null) return '—';
    return val.toFixed(6);
};

const formatTime = (dt) => {
    if (!dt) return '—';
    return dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

onMounted(() => {
    if (props.autoCapture) captureLocation();
});

onUnmounted(() => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
});

defineExpose({ captureLocation, coords, state });
</script>

<template>
    <div class="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
                    <svg class="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h3 class="text-sm font-semibold text-text">{{ label }}</h3>
            </div>
            <button
                v-if="state !== 'requesting'"
                type="button"
                class="btn-secondary btn-sm text-xs"
                @click="captureLocation"
            >
                Refresh
            </button>
        </div>

        <!-- Requesting state -->
        <div v-if="state === 'requesting'" class="flex items-center gap-3 py-4">
            <div class="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            <span class="text-sm text-text-muted">Acquiring GPS signal...</span>
        </div>

        <!-- Success state -->
        <div v-else-if="state === 'success'" class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
                <div class="rounded-xl bg-surface-subtle p-3">
                    <p class="mb-1 text-xs font-medium text-text-soft uppercase tracking-wide">Latitude</p>
                    <p class="font-mono text-sm font-semibold text-text">{{ formatCoord(coords?.latitude) }}°</p>
                </div>
                <div class="rounded-xl bg-surface-subtle p-3">
                    <p class="mb-1 text-xs font-medium text-text-soft uppercase tracking-wide">Longitude</p>
                    <p class="font-mono text-sm font-semibold text-text">{{ formatCoord(coords?.longitude) }}°</p>
                </div>
            </div>
            <div class="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs">
                <span class="flex items-center gap-1.5 text-emerald-700">
                    <span class="h-2 w-2 rounded-full bg-emerald-500" />
                    Accuracy: ±{{ accuracy }}m
                </span>
                <span class="text-emerald-600">{{ formatTime(capturedAt) }}</span>
            </div>
        </div>

        <!-- Denied state -->
        <div v-else-if="state === 'denied'" class="rounded-xl bg-red-50 p-4">
            <div class="flex items-start gap-3">
                <svg class="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <p class="text-sm font-semibold text-red-700">Location Access Denied</p>
                    <p class="mt-0.5 text-xs text-red-600">{{ errorMessage }}</p>
                </div>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="state === 'error'" class="rounded-xl bg-amber-50 p-4">
            <p class="text-sm text-amber-700">{{ errorMessage }}</p>
            <button type="button" class="mt-2 text-xs font-medium text-amber-700 underline" @click="captureLocation">
                Try again
            </button>
        </div>

        <!-- Idle state -->
        <div v-else class="py-3 text-sm text-text-muted">
            Click "Refresh" to capture your location.
        </div>
    </div>
</template>
