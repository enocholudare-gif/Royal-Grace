<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import { onUnmounted, ref } from 'vue';
import CaregiverLayout from '../../../Layouts/CaregiverLayout.vue';
import VisitTimeline from '../../../Components/Visits/VisitTimeline.vue';

defineOptions({ layout: CaregiverLayout });

const props = defineProps({
    booking: { type: Object, required: true },
    visitReport: { type: Object, required: true },
});

const notes = ref(props.visitReport?.notes ?? '');
const saveStatus = ref('idle'); // idle | saving | saved
let autoSaveTimer = null;

// Auto-save to localStorage every 30 seconds
const localKey = `visit_draft_${props.visitReport?.id}`;
const savedDraft = localStorage.getItem(localKey);
if (savedDraft) {
    try { notes.value = JSON.parse(savedDraft); } catch (_) {}
}

const saveDraft = () => {
    saveStatus.value = 'saving';
    localStorage.setItem(localKey, JSON.stringify(notes.value));
    setTimeout(() => { saveStatus.value = 'saved'; }, 400);
    setTimeout(() => { saveStatus.value = 'idle'; }, 3000);
};

autoSaveTimer = setInterval(saveDraft, 30000);

onUnmounted(() => {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
});

const formatTime = (dt) => {
    if (!dt) return '—';
    return new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
    <Head title="Active Visit" />

    <div class="space-y-6">
        <!-- Active indicator bar -->
        <div class="flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
            <div class="relative flex h-3 w-3">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span class="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
            </div>
            <div>
                <p class="text-sm font-semibold text-amber-800">Visit In Progress</p>
                <p class="text-xs text-amber-700">Started at {{ formatTime(visitReport?.arrival_time) }}</p>
            </div>
        </div>

        <!-- Back -->
        <Link href="/caregiver/visits" class="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Visits
        </Link>

        <div class="grid gap-6 lg:grid-cols-[1fr_340px]">
            <!-- Main -->
            <div class="space-y-5">
                <!-- Client & Service -->
                <div class="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <h2 class="mb-4 text-sm font-semibold text-text-soft uppercase tracking-wide">Current Visit</h2>
                    <div class="grid gap-3 sm:grid-cols-2">
                        <div>
                            <p class="text-xs text-text-soft">Client</p>
                            <p class="font-semibold text-text">{{ booking.client?.user?.name ?? '—' }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-text-soft">Service</p>
                            <p class="font-medium text-text">{{ booking.service_name_snapshot ?? '—' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Care Instructions -->
                <div v-if="booking.care_instructions" class="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <h2 class="mb-2 text-sm font-semibold text-amber-800">Care Instructions</h2>
                    <p class="text-sm leading-relaxed text-amber-900">{{ booking.care_instructions }}</p>
                </div>

                <!-- Notes -->
                <div class="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <div class="mb-3 flex items-center justify-between">
                        <h2 class="text-sm font-semibold text-text">Visit Notes</h2>
                        <div class="flex items-center gap-2 text-xs">
                            <span v-if="saveStatus === 'saving'" class="text-text-soft">Saving…</span>
                            <span v-else-if="saveStatus === 'saved'" class="flex items-center gap-1 text-emerald-600">
                                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Draft saved
                            </span>
                            <button type="button" class="text-brand-600 hover:underline" @click="saveDraft">
                                Save draft
                            </button>
                        </div>
                    </div>
                    <textarea
                        v-model="notes"
                        rows="5"
                        class="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text placeholder:text-text-soft focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition"
                        placeholder="Add notes about the visit, client observations, or important reminders…"
                    />
                    <p class="mt-1.5 text-xs text-text-muted">Notes auto-save every 30 seconds to your device.</p>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-5">
                <VisitTimeline
                    :check-in-time="visitReport?.arrival_time"
                    :check-out-time="visitReport?.departure_time"
                />

                <!-- Check-Out Action -->
                <div class="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <h2 class="mb-3 text-sm font-semibold text-text-soft uppercase tracking-wide">Actions</h2>
                    <Link
                        :href="`/caregiver/visits/${booking.id}/check-out`"
                        class="block w-full rounded-xl bg-rose-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
                    >
                        Proceed to Check-Out
                    </Link>
                    <p class="mt-2 text-center text-xs text-text-muted">GPS check-out will be required</p>
                </div>
            </div>
        </div>
    </div>
</template>
