<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AdminLayout from '../../../Layouts/AdminLayout.vue';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    caregiver: {
        type: Object,
        required: true,
    },
});

</script>

<template>
    <Head title="Caregiver Details" />

    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <Link href="/admin/caregivers" class="mb-1 inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Back to Caregivers
                </Link>
                <h1 class="text-2xl font-bold tracking-tight text-text">{{ caregiver.first_name }} {{ caregiver.last_name }}</h1>
                <p class="mt-1 text-sm text-text-muted">
                    {{ caregiver.email }}
                </p>
            </div>
            <div class="flex gap-2">
                <Link :href="`/admin/caregivers/${caregiver.id}/edit`" class="btn-primary shrink-0">
                    Edit Profile
                </Link>
            </div>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
            <div class="md:col-span-2 space-y-6">
                <!-- Personal Info -->
                <div class="card p-6">
                    <h2 class="text-lg font-semibold text-text mb-4">Personal Information</h2>
                    <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                            <dt class="text-sm font-medium text-text-muted">Phone Number</dt>
                            <dd class="mt-1 text-sm text-text">{{ caregiver.phone || '—' }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-text-muted">Status</dt>
                            <dd class="mt-1">
                                <span class="status-indicator" :class="{
                                    'status-active': caregiver.status === 'active',
                                    'status-pending': caregiver.status === 'inactive',
                                    'status-danger': caregiver.status === 'suspended',
                                }">
                                    {{ caregiver.status.charAt(0).toUpperCase() + caregiver.status.slice(1) }}
                                </span>
                            </dd>
                        </div>
                        <div class="sm:col-span-2">
                            <dt class="text-sm font-medium text-text-muted">Address</dt>
                            <dd class="mt-1 text-sm text-text">
                                {{ caregiver.address_line_1 }}<br />
                                <template v-if="caregiver.address_line_2">{{ caregiver.address_line_2 }}<br /></template>
                                {{ caregiver.city }}, {{ caregiver.state }} {{ caregiver.postal_code }}<br />
                                {{ caregiver.country }}
                            </dd>
                        </div>
                        <div class="sm:col-span-2">
                            <dt class="text-sm font-medium text-text-muted">Bio</dt>
                            <dd class="mt-1 text-sm text-text">{{ caregiver.bio || '—' }}</dd>
                        </div>
                    </dl>
                </div>

                <!-- Emergency Contact -->
                <div class="card p-6">
                    <h2 class="text-lg font-semibold text-text mb-4">Emergency Contact</h2>
                    <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                            <dt class="text-sm font-medium text-text-muted">Name</dt>
                            <dd class="mt-1 text-sm text-text">{{ caregiver.emergency_contact_name || '—' }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-text-muted">Phone</dt>
                            <dd class="mt-1 text-sm text-text">{{ caregiver.emergency_contact_phone || '—' }}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <!-- Sidebar Actions -->
            <div class="space-y-6">
                <div class="card p-6">
                    <h3 class="font-semibold text-text mb-4">Quick Actions</h3>
                    <div class="flex flex-col gap-3">
                        <Link :href="`/admin/caregivers/${caregiver.id}/availability`" class="btn-secondary w-full justify-start">
                            Manage Availability
                        </Link>
                        <Link :href="`/admin/caregivers/${caregiver.id}/attendance`" class="btn-secondary w-full justify-start">
                            View Attendance
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
