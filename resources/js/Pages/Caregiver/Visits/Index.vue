<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import CaregiverLayout from '../../../Layouts/CaregiverLayout.vue';
import LoadingSkeleton from '../../../Components/Visits/LoadingSkeleton.vue';
import VisitCard from '../../../Components/Visits/VisitCard.vue';

defineOptions({ layout: CaregiverLayout });

const props = defineProps({
    bookings: { type: Object, required: true },
    filters: { type: Object, default: () => ({}) },
});

const activeTab = ref(props.filters.tab ?? 'upcoming');
const search = ref(props.filters.search ?? '');
const dateFilter = ref(props.filters.dateFilter ?? '');
const statusFilter = ref(props.filters.statusFilter ?? '');
const loading = ref(false);

const applyFilters = () => {
    loading.value = true;
    router.get('/caregiver/visits', {
        tab: activeTab.value,
        search: search.value,
        date: dateFilter.value,
        status: statusFilter.value,
    }, {
        preserveState: true,
        replace: true,
        onFinish: () => { loading.value = false; },
    });
};

const switchTab = (tab) => {
    activeTab.value = tab;
    statusFilter.value = '';
    applyFilters();
};

let searchTimeout;
watch(search, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 400);
});

const statusOptions = {
    upcoming: [
        { value: '', label: 'All statuses' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'in_progress', label: 'In Progress' },
    ],
    completed: [
        { value: '', label: 'All' },
        { value: 'completed', label: 'Completed' },
        { value: 'submitted', label: 'Report Submitted' },
        { value: 'reviewed', label: 'Reviewed' },
    ],
};

const tabs = [
    { key: 'upcoming', label: 'Upcoming & Active' },
    { key: 'completed', label: 'Completed' },
];

const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
};
</script>

<template>
    <Head title="My Visits – Caregiver" />

    <div class="space-y-6">
        <!-- Page Header -->
        <div>
            <h1 class="text-2xl font-bold text-text">My Visits</h1>
            <p class="mt-1 text-sm text-text-muted">Manage your scheduled visits, check-ins, check-outs and reports.</p>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 rounded-xl border border-border bg-surface-subtle p-1">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                :class="activeTab === tab.key
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-text-muted hover:bg-surface hover:text-text'"
                @click="switchTab(tab.key)"
            >
                {{ tab.label }}
            </button>
        </div>

        <!-- Filters Row -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <!-- Search -->
            <div class="relative flex-1">
                <svg class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    v-model="search"
                    type="search"
                    placeholder="Search by client name or service…"
                    class="w-full rounded-xl border border-border bg-surface-subtle py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-soft focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
            </div>

            <!-- Date filter -->
            <input
                v-model="dateFilter"
                type="date"
                class="rounded-xl border border-border bg-surface-subtle px-4 py-2.5 text-sm text-text focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                @change="applyFilters"
            />

            <!-- Status filter -->
            <select
                v-model="statusFilter"
                class="rounded-xl border border-border bg-surface-subtle px-4 py-2.5 text-sm text-text focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                @change="applyFilters"
            >
                <option v-for="opt in (statusOptions[activeTab] || statusOptions.upcoming)" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                </option>
            </select>
        </div>

        <!-- Loading skeletons -->
        <div v-if="loading" class="space-y-4">
            <LoadingSkeleton :rows="3" />
        </div>

        <!-- Visits Grid -->
        <template v-else>
            <div v-if="bookings.data?.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <VisitCard
                    v-for="booking in bookings.data"
                    :key="booking.id"
                    :booking="booking"
                />
            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
                    <svg class="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p class="text-base font-semibold text-text">No visits found</p>
                <p class="mt-1 text-sm text-text-muted">
                    {{ activeTab === 'upcoming' ? 'You have no upcoming visits matching your filters.' : 'No completed visits to show.' }}
                </p>
                <button v-if="search || dateFilter || statusFilter" type="button" class="mt-4 btn-secondary btn-sm" @click="search = ''; dateFilter = ''; statusFilter = ''; applyFilters()">
                    Clear Filters
                </button>
            </div>

            <!-- Pagination -->
            <div v-if="bookings.last_page > 1" class="flex items-center justify-between text-sm">
                <span class="text-text-muted">
                    Showing {{ bookings.from }}–{{ bookings.to }} of {{ bookings.total }} visits
                </span>
                <div class="flex gap-1">
                    <Link
                        v-if="bookings.prev_page_url"
                        :href="bookings.prev_page_url"
                        class="btn-secondary btn-sm"
                    >← Prev</Link>
                    <Link
                        v-if="bookings.next_page_url"
                        :href="bookings.next_page_url"
                        class="btn-secondary btn-sm"
                    >Next →</Link>
                </div>
            </div>
        </template>
    </div>
</template>
