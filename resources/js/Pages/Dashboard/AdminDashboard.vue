<script setup>
import { computed, onMounted, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import ActivityTable from '../../Components/Dashboard/ActivityTable.vue';
import ChartCard from '../../Components/Dashboard/ChartCard.vue';
import MetricCard from '../../Components/Dashboard/MetricCard.vue';
import NotificationFeed from '../../Components/Dashboard/NotificationFeed.vue';
import { useDashboardData } from '../../Composables/useDashboardData';
import AdminLayout from '../../Layouts/AdminLayout.vue';

defineOptions({ layout: AdminLayout });

const dashboard = ref({
    metrics: [],
    chartSeries: [],
    notifications: [],
    activity: [],
});

const dashboardColumns = [
    { key: 'booking_number', label: 'Booking' },
    { key: 'client', label: 'Client' },
    { key: 'service', label: 'Service' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' },
];

const { loadAdminDashboard, loading, error } = useDashboardData();

const flashMessage = computed(() => {
    const value = localStorage.getItem('auth_flash_success');

    if (value) {
        localStorage.removeItem('auth_flash_success');
    }

    return value;
});

onMounted(async () => {
    try {
        dashboard.value = await loadAdminDashboard();
    } catch (_) {
        //
    }
});
</script>

<template>
    <Head title="Admin Dashboard" />

    <div class="space-y-6">
        <div v-if="flashMessage" class="alert-success">
            <span class="font-semibold">Success:</span>
            <span>{{ flashMessage }}</span>
        </div>

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
                title="Revenue and booking momentum"
                subtitle="Recent transactional activity across active operations."
                :series="dashboard.chartSeries"
                color-class="text-brand-600"
            />

            <NotificationFeed :items="dashboard.notifications" title="Admin notifications" />
        </div>

        <ActivityTable
            title="Latest bookings"
            subtitle="Recent booking activity across clients and services."
            :columns="dashboardColumns"
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
