<script setup>
import { Head, Link } from '@inertiajs/vue3';
import CaregiverLayout from '../../../Layouts/CaregiverLayout.vue';
import VisitTimeline from '../../../Components/Visits/VisitTimeline.vue';
import ReportForm from '../../../Components/Visits/ReportForm.vue';

defineOptions({ layout: CaregiverLayout });

const props = defineProps({
    visitReport: { type: Object, required: true },
    flash: { type: String, default: null },
});

const formatDateTime = (dt) => {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit',
    });
};
</script>

<template>
    <Head title="Submit Visit Report" />

    <div class="space-y-6">
        <!-- Back -->
        <Link href="/caregiver/visits" class="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Visits
        </Link>

        <!-- Flash success -->
        <div v-if="flash" class="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <svg class="h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p class="text-sm font-medium text-emerald-800">{{ flash }}</p>
        </div>

        <!-- Header -->
        <div>
            <h1 class="text-2xl font-bold text-text">Submit Visit Report</h1>
            <p class="mt-1 text-sm text-text-muted">
                Complete the report for
                <strong>{{ visitReport.booking?.client?.user?.name ?? 'this client' }}</strong>
            </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1fr_340px]">
            <!-- Report Form -->
            <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <h2 class="mb-5 text-base font-semibold text-text">Visit Report Details</h2>
                <ReportForm
                    :visit-report="visitReport"
                    :submit-url="`/caregiver/visits/reports/${visitReport.id}`"
                />
            </div>

            <!-- Sidebar -->
            <div class="space-y-5">
                <!-- Timeline -->
                <VisitTimeline
                    :check-in-time="visitReport.arrival_time"
                    :check-out-time="visitReport.departure_time"
                />

                <!-- Summary card -->
                <div class="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <h2 class="mb-3 text-sm font-semibold text-text-soft uppercase tracking-wide">Visit Summary</h2>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-text-soft">Client</span>
                            <span class="font-medium text-text">{{ visitReport.booking?.client?.user?.name ?? '—' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-text-soft">Service</span>
                            <span class="font-medium text-text">{{ visitReport.booking?.service_name_snapshot ?? '—' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-text-soft">Arrived</span>
                            <span class="font-medium text-text">{{ formatDateTime(visitReport.arrival_time) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-text-soft">Departed</span>
                            <span class="font-medium text-text">{{ formatDateTime(visitReport.departure_time) }}</span>
                        </div>
                    </div>
                </div>

                <!-- GPS summary -->
                <div class="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <h2 class="mb-3 text-sm font-semibold text-text-soft uppercase tracking-wide">GPS Coordinates</h2>
                    <div class="space-y-3 text-sm">
                        <div>
                            <p class="text-xs text-text-soft">Check-In</p>
                            <p class="font-mono text-xs text-text">
                                {{ visitReport.check_in_latitude?.toFixed(6) ?? '—' }},
                                {{ visitReport.check_in_longitude?.toFixed(6) ?? '—' }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs text-text-soft">Check-Out</p>
                            <p class="font-mono text-xs text-text">
                                {{ visitReport.check_out_latitude?.toFixed(6) ?? '—' }},
                                {{ visitReport.check_out_longitude?.toFixed(6) ?? '—' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
