<script setup>
import { computed, onUnmounted, ref } from 'vue';

const props = defineProps({
    checkInTime: { type: String, default: null },
    checkOutTime: { type: String, default: null },
});

const now = ref(new Date());
let timer = null;

const formatTime = (dt) => {
    if (!dt) return null;
    return new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dt) => {
    if (!dt) return null;
    return new Date(dt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
};

const elapsedMinutes = computed(() => {
    if (!props.checkInTime) return null;
    const start = new Date(props.checkInTime);
    const end = props.checkOutTime ? new Date(props.checkOutTime) : now.value;
    return Math.floor((end - start) / 60000);
});

const elapsedFormatted = computed(() => {
    const m = elapsedMinutes.value;
    if (m === null) return '—';
    const h = Math.floor(m / 60);
    const mins = m % 60;
    if (h > 0) return `${h}h ${mins}m`;
    return `${mins}m`;
});

if (!props.checkOutTime) {
    timer = setInterval(() => { now.value = new Date(); }, 30000);
}

onUnmounted(() => { if (timer) clearInterval(timer); });
</script>

<template>
    <div class="relative rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold text-text-soft uppercase tracking-wide">Visit Timeline</h3>

        <div class="relative pl-6">
            <!-- Vertical line -->
            <div class="absolute left-2 top-3 bottom-3 w-px bg-border" />

            <!-- Check-in -->
            <div class="relative mb-6">
                <div class="absolute -left-4 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-surface"
                    :class="checkInTime ? 'bg-emerald-500' : 'bg-slate-200'">
                    <span v-if="checkInTime" class="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div>
                    <p class="text-xs font-medium text-text-soft uppercase tracking-wide">Check-In</p>
                    <p v-if="checkInTime" class="mt-0.5 text-base font-semibold text-text">{{ formatTime(checkInTime) }}</p>
                    <p v-if="checkInTime" class="text-xs text-text-muted">{{ formatDate(checkInTime) }}</p>
                    <p v-else class="mt-0.5 text-sm text-text-muted italic">Not yet checked in</p>
                </div>
            </div>

            <!-- Duration (only if checked in) -->
            <div v-if="checkInTime" class="relative mb-6">
                <div class="absolute -left-4 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-surface bg-amber-400">
                    <span class="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div>
                    <p class="text-xs font-medium text-text-soft uppercase tracking-wide">Duration</p>
                    <p class="mt-0.5 text-base font-semibold text-amber-600">{{ elapsedFormatted }}</p>
                    <p v-if="!checkOutTime" class="text-xs text-text-muted">Visit in progress…</p>
                </div>
            </div>

            <!-- Check-out -->
            <div class="relative">
                <div class="absolute -left-4 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-surface"
                    :class="checkOutTime ? 'bg-violet-500' : 'bg-slate-200'">
                    <span v-if="checkOutTime" class="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div>
                    <p class="text-xs font-medium text-text-soft uppercase tracking-wide">Check-Out</p>
                    <p v-if="checkOutTime" class="mt-0.5 text-base font-semibold text-text">{{ formatTime(checkOutTime) }}</p>
                    <p v-if="checkOutTime" class="text-xs text-text-muted">{{ formatDate(checkOutTime) }}</p>
                    <p v-else class="mt-0.5 text-sm text-text-muted italic">Not yet checked out</p>
                </div>
            </div>
        </div>
    </div>
</template>
