<script setup>
import { onMounted, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import ActivityTable from '../../Components/Dashboard/ActivityTable.vue';
import ChartCard from '../../Components/Dashboard/ChartCard.vue';
import MetricCard from '../../Components/Dashboard/MetricCard.vue';
import NotificationFeed from '../../Components/Dashboard/NotificationFeed.vue';
import { useDashboardData } from '../../Composables/useDashboardData';
import ClientLayout from '../../Layouts/ClientLayout.vue';

defineOptions({ layout: ClientLayout });

const dashboard = ref({
    metrics: [],
    chartSeries: [],
    notifications: [],
    activity: [],
});

const bookingColumns = [
    { key: 'reference', label: 'Booking' },
    { key: 'subject', label: 'Service' },
    { key: 'category', label: 'Caregiver' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' },
];

const { loadClientDashboard, loading, error } = useDashboardData();

onMounted(async () => {
    try {
        dashboard.value = await loadClientDashboard();
    } catch (_) {
        //
    }
});
</script>

<template>
    <Head title="Client Dashboard" />

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
                title="Payment activity"
                subtitle="Recent financial activity linked to your bookings."
                :series="dashboard.chartSeries"
                color-class="text-success-600"
            />

            <NotificationFeed :items="dashboard.notifications" title="Client notifications" />
        </div>

        <ActivityTable
            title="Your bookings"
            subtitle="Track service assignments, dates, and progress."
            :columns="bookingColumns"
            :rows="dashboard.activity"
        >
            <template #status="{ row }">
                <span class="status-indicator" :class="{
                    'status-pending': ['pending', 'awaiting_payment'].includes(String(row.status).toLowerCase()),
                    'status-info': ['confirmed', 'assigned', 'in_progress'].includes(String(row.status).toLowerCase()),
                    'status-active': String(row.status).toLowerCase() === 'completed',
                    'status-danger': ['cancelled', 'refunded'].includes(String(row.status).toLowerCase()),
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
