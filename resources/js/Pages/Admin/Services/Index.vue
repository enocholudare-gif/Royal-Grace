<script setup>
import { Head, Link } from '@inertiajs/vue3';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import AdminLayout from '../../../Layouts/AdminLayout.vue';

defineOptions({ layout: AdminLayout });

// --- State ---
const services = ref([]);
const loading = ref(true);
const error = ref('');
const search = ref('');
const statusFilter = ref('');
const deletingId = ref(null);
const flashMessage = ref('');

// --- Computed filtered list ---
const filtered = computed(() => {
    let list = services.value;

    if (search.value.trim()) {
        const q = search.value.trim().toLowerCase();
        list = list.filter(s =>
            s.name.toLowerCase().includes(q) ||
            (s.description ?? '').toLowerCase().includes(q)
        );
    }

    if (statusFilter.value) {
        list = list.filter(s => s.status === statusFilter.value);
    }

    return list;
});

// --- Helpers ---
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
};

// --- Data fetching ---
const fetchServices = async () => {
    loading.value = true;
    error.value = '';
    try {
        const response = await axios.get('/services');
        services.value = response.data.data || [];
    } catch (e) {
        error.value = 'Failed to load services. Please refresh and try again.';
    } finally {
        loading.value = false;
    }
};

// --- Actions ---
const deleteService = async (service) => {
    if (!confirm(`Delete "${service.name}"? This action cannot be undone.`)) return;

    deletingId.value = service.id;
    try {
        await axios.delete(`/services/${service.id}`);
        services.value = services.value.filter(s => s.id !== service.id);
        flashMessage.value = `"${service.name}" deleted successfully.`;
        setTimeout(() => (flashMessage.value = ''), 4000);
    } catch (e) {
        alert('Failed to delete the service. It may have active bookings.');
    } finally {
        deletingId.value = null;
    }
};

const disableService = async (service) => {
    try {
        const response = await axios.patch(`/services/${service.id}/disable`);
        const updated = response.data.data ?? response.data;
        const index = services.value.findIndex(s => s.id === service.id);
        if (index !== -1) services.value[index] = { ...services.value[index], ...updated };
        flashMessage.value = `"${service.name}" has been disabled.`;
        setTimeout(() => (flashMessage.value = ''), 4000);
    } catch (e) {
        alert('Failed to disable the service.');
    }
};

onMounted(() => {
    const stored = localStorage.getItem('auth_flash_success');
    if (stored) {
        flashMessage.value = stored;
        localStorage.removeItem('auth_flash_success');
        setTimeout(() => (flashMessage.value = ''), 5000);
    }
    fetchServices();
});
</script>

<template>
    <Head title="Service Management" />

    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-text">Services</h1>
                <p class="mt-1 text-sm text-text-muted">
                    Manage the care services available for client bookings.
                </p>
            </div>
            <Link href="/admin/services/create" class="btn-primary shrink-0">
                + New service
            </Link>
        </div>

        <!-- Flash Message -->
        <div v-if="flashMessage" class="alert-success flex items-center justify-between">
            <span>{{ flashMessage }}</span>
            <button class="text-sm opacity-60 hover:opacity-100" @click="flashMessage = ''">✕</button>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert-danger">
            <span class="font-semibold">Error:</span> {{ error }}
        </div>

        <!-- Filters -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div class="relative flex-1">
                <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" stroke-linecap="round" />
                </svg>
                <input
                    id="service-search"
                    v-model="search"
                    type="search"
                    placeholder="Search services by name or description..."
                    class="input-field pl-9"
                />
            </div>
            <select
                id="service-status-filter"
                v-model="statusFilter"
                class="input-field w-full sm:w-44"
            >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
        </div>

        <!-- Table -->
        <div class="table-wrap">
            <div class="card-header flex items-center justify-between">
                <div>
                    <p class="card-title">All services</p>
                    <p class="card-subtitle">{{ filtered.length }} service{{ filtered.length !== 1 ? 's' : '' }} found</p>
                </div>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading" class="divide-y divide-border">
                <div v-for="n in 4" :key="n" class="flex items-center gap-4 p-4">
                    <div class="h-4 w-48 animate-pulse rounded bg-surface-subtle" />
                    <div class="h-4 w-24 animate-pulse rounded bg-surface-subtle" />
                    <div class="h-4 w-16 animate-pulse rounded bg-surface-subtle" />
                    <div class="ml-auto h-4 w-16 animate-pulse rounded bg-surface-subtle" />
                </div>
            </div>

            <!-- Table content -->
            <table v-else class="table-standard">
                <thead>
                    <tr>
                        <th>Service Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="service in filtered" :key="service.id" class="group">
                        <td class="font-medium text-text">{{ service.name }}</td>
                        <td class="max-w-xs truncate text-text-muted">
                            {{ service.description || '—' }}
                        </td>
                        <td class="font-medium text-text">{{ formatPrice(service.price) }}</td>
                        <td>{{ service.duration_minutes }} mins</td>
                        <td>
                            <span class="status-indicator" :class="{
                                'status-active': service.status === 'active',
                                'status-pending': service.status === 'inactive',
                            }">
                                {{ service.status.charAt(0).toUpperCase() + service.status.slice(1) }}
                            </span>
                        </td>
                        <td class="text-right">
                            <div class="flex items-center justify-end gap-3">
                                <Link :href="`/admin/services/${service.id}`"
                                    class="text-sm font-medium text-brand-600 hover:text-brand-700">
                                    View
                                </Link>
                                <Link :href="`/admin/services/${service.id}/edit`"
                                    class="text-sm font-medium text-text-muted hover:text-text">
                                    Edit
                                </Link>
                                <button
                                    v-if="service.status === 'active'"
                                    class="text-sm font-medium text-amber-600 hover:text-amber-700"
                                    @click="disableService(service)"
                                >
                                    Disable
                                </button>
                                <button
                                    class="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-40"
                                    :disabled="deletingId === service.id"
                                    @click="deleteService(service)"
                                >
                                    {{ deletingId === service.id ? 'Deleting…' : 'Delete' }}
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="!loading && filtered.length === 0">
                        <td colspan="6" class="table-empty">
                            <div class="flex flex-col items-center gap-2 py-10">
                                <svg class="h-10 w-10 text-text-muted opacity-40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                    <path d="M9 12h6M9 8h6M9 16h4M7 4h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p class="text-sm text-text-muted">
                                    {{ search || statusFilter ? 'No services match your filters.' : 'No services yet. Create your first service.' }}
                                </p>
                                <Link v-if="!search && !statusFilter" href="/admin/services/create" class="btn-primary btn-sm mt-1">
                                    Create service
                                </Link>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
