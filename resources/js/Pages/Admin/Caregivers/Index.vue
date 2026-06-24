<script setup>
import { Head, Link } from '@inertiajs/vue3';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import AdminLayout from '../../../Layouts/AdminLayout.vue';

defineOptions({ layout: AdminLayout });

// --- State ---
const caregivers = ref([]);
const loading = ref(true);
const error = ref('');
const search = ref('');
const statusFilter = ref('');
const flashMessage = ref('');

// --- Computed filtered list ---
const filtered = computed(() => {
    let list = caregivers.value;

    if (search.value.trim()) {
        const q = search.value.trim().toLowerCase();
        list = list.filter(c =>
            c.first_name.toLowerCase().includes(q) ||
            c.last_name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q)
        );
    }

    if (statusFilter.value) {
        list = list.filter(c => c.status === statusFilter.value);
    }

    return list;
});

// --- Data fetching ---
const fetchCaregivers = async () => {
    loading.value = true;
    error.value = '';
    try {
        const response = await axios.get('/caregivers');
        caregivers.value = response.data.data || [];
    } catch (e) {
        error.value = 'Failed to load caregivers. Please refresh and try again.';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    const stored = localStorage.getItem('auth_flash_success');
    if (stored) {
        flashMessage.value = stored;
        localStorage.removeItem('auth_flash_success');
        setTimeout(() => (flashMessage.value = ''), 5000);
    }
    fetchCaregivers();
});
</script>

<template>
    <Head title="Caregiver Management" />

    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-text">Caregivers</h1>
                <p class="mt-1 text-sm text-text-muted">
                    Manage your caregiver team, assignments, and availability.
                </p>
            </div>
            <Link href="/admin/caregivers/create" class="btn-primary shrink-0">
                + Add caregiver
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
                    id="caregiver-search"
                    v-model="search"
                    type="search"
                    placeholder="Search caregivers by name or email..."
                    class="input-field pl-9 block w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                />
            </div>
            <select
                id="caregiver-status-filter"
                v-model="statusFilter"
                class="input-field w-full sm:w-44 block rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
            >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
            </select>
        </div>

        <!-- Table -->
        <div class="table-wrap">
            <div class="card-header flex items-center justify-between">
                <div>
                    <p class="card-title">All Caregivers</p>
                    <p class="card-subtitle">{{ filtered.length }} caregiver{{ filtered.length !== 1 ? 's' : '' }} found</p>
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
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="caregiver in filtered" :key="caregiver.id" class="group">
                        <td class="font-medium text-text">{{ caregiver.first_name }} {{ caregiver.last_name }}</td>
                        <td class="text-text-muted">{{ caregiver.email }}</td>
                        <td class="text-text-muted">{{ caregiver.phone || '—' }}</td>
                        <td>
                            <span class="status-indicator" :class="{
                                'status-active': caregiver.status === 'active',
                                'status-pending': caregiver.status === 'inactive',
                                'status-danger': caregiver.status === 'suspended',
                            }">
                                {{ caregiver.status.charAt(0).toUpperCase() + caregiver.status.slice(1) }}
                            </span>
                        </td>
                        <td class="text-right">
                            <div class="flex items-center justify-end gap-3">
                                <Link :href="`/admin/caregivers/${caregiver.id}`"
                                    class="text-sm font-medium text-brand-600 hover:text-brand-700">
                                    View
                                </Link>
                                <Link :href="`/admin/caregivers/${caregiver.id}/edit`"
                                    class="text-sm font-medium text-text-muted hover:text-text">
                                    Edit
                                </Link>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="!loading && filtered.length === 0">
                        <td colspan="5" class="table-empty">
                            <div class="flex flex-col items-center gap-2 py-10">
                                <svg class="h-10 w-10 text-text-muted opacity-40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p class="text-sm text-text-muted">
                                    {{ search || statusFilter ? 'No caregivers match your filters.' : 'No caregivers yet. Add your first caregiver.' }}
                                </p>
                                <Link v-if="!search && !statusFilter" href="/admin/caregivers/create" class="btn-primary btn-sm mt-1">
                                    Add caregiver
                                </Link>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
