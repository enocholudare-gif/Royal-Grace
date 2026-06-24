<script setup>
import { onMounted, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import ActivityTable from '../../Components/Dashboard/ActivityTable.vue';
import ChartCard from '../../Components/Dashboard/ChartCard.vue';
import MetricCard from '../../Components/Dashboard/MetricCard.vue';
import NotificationFeed from '../../Components/Dashboard/NotificationFeed.vue';
import { useDashboardData } from '../../Composables/useDashboardData';
import FamilyLayout from '../../Layouts/FamilyLayout.vue';

defineOptions({ layout: FamilyLayout });

const dashboard = ref({
    metrics: [],
    chartSeries: [],
    notifications: [],
    visits: [],
});

const visitColumns = [
    { key: 'booking', label: 'Booking' },
    { key: 'caregiver', label: 'Caregiver' },
    { key: 'condition', label: 'Client Condition' },
    { key: 'arrival', label: 'Arrival' },
    { key: 'departure', label: 'Departure' },
];

const { loadFamilyDashboard, loading, error } = useDashboardData();

onMounted(async () => {
    try {
        dashboard.value = await loadFamilyDashboard();
    } catch (_) {
        //
    }
});
</script>

<template>
    <Head title="Family Dashboard" />

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
                title="Linked booking overview"
                subtitle="Recent booking volume for your assigned client."
                :series="dashboard.chartSeries"
                color-class="text-purple-600"
            />

            <NotificationFeed :items="dashboard.notifications" title="Family notifications" />
        </div>

        <ActivityTable
            title="Completed visits"
            subtitle="Latest visit outcomes and care observations."
            :columns="visitColumns"
            :rows="dashboard.visits"
        />

        <div v-if="loading" class="card">
            <div class="card-body text-sm text-text-muted">Loading dashboard...</div>
        </div>
    </div>
</template>
