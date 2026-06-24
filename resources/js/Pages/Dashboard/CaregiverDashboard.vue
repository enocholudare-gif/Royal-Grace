<script setup>
import { onMounted, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import ActivityTable from '../../Components/Dashboard/ActivityTable.vue';
import ChartCard from '../../Components/Dashboard/ChartCard.vue';
import MetricCard from '../../Components/Dashboard/MetricCard.vue';
import NotificationFeed from '../../Components/Dashboard/NotificationFeed.vue';
import { useDashboardData } from '../../Composables/useDashboardData';
import CaregiverLayout from '../../Layouts/CaregiverLayout.vue';

defineOptions({ layout: CaregiverLayout });

const dashboard = ref({
    metrics: [],
    chartSeries: [],
    notifications: [],
    visits: [],
});

const visitColumns = [
    { key: 'booking', label: 'Booking' },
    { key: 'client', label: 'Client' },
    { key: 'arrival', label: 'Arrival' },
    { key: 'departure', label: 'Departure' },
    { key: 'status', label: 'Status' },
];

const { loadCaregiverDashboard, loading, error } = useDashboardData();

onMounted(async () => {
    try {
        dashboard.value = await loadCaregiverDashboard();
    } catch (_) {
        //
    }
});
</script>

<template>
    <Head title="Caregiver Dashboard" />

    <div class="space-y-6">
        <div v-if="error" class="alert-danger">
            <span class="font-semibold">Unable to load dashboard:</span>
            <span>{{ error }}</span>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
                v-for="metric in dashboard.metrics"
                :key="metric.label"
                :label="metric.label"
                :value="metric.value"
                :change="metric.change"
                :tone="metric.tone"
            />
        </div>

        <div class="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <ChartCard
                title="Visit completion flow"
                subtitle="Progress across your latest assigned visits."
                :series="dashboard.chartSeries"
                color-class="text-info-600"
            />

            <NotificationFeed :items="dashboard.notifications" title="Care alerts" />
        </div>

        <ActivityTable
            title="Visit activity"
            subtitle="Check-in, check-out, and report progress."
            :columns="visitColumns"
            :rows="dashboard.visits"
        >
            <template #status="{ row }">
                <span class="status-indicator" :class="{
                    'status-pending': String(row.status).toLowerCase() === 'pending',
                    'status-info': String(row.status).toLowerCase() === 'in progress',
                    'status-active': String(row.status).toLowerCase() === 'completed',
                }">
                    {{ row.status }}
                </span>
            </template>
        </ActivityTable>

        <div v-if="loading" class="card">
            <div class="card-body text-sm text-text-muted">Loading dashboard...</div>
        </div>
    </div>
</template>
