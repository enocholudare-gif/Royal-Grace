<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import axios from 'axios';
import { ref } from 'vue';
import AdminLayout from '../../../Layouts/AdminLayout.vue';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    service: {
        type: Object,
        required: true,
    },
});

const isDeleting = ref(false);

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
};

const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
        return;
    }

    isDeleting.value = true;
    try {
        await axios.delete(`/services/${props.service.id}`);
        localStorage.setItem('auth_flash_success', 'Service deleted successfully.');
        router.visit('/admin/services');
    } catch (e) {
        alert('Failed to delete the service. It might be linked to existing bookings.');
        isDeleting.value = false;
    }
};
</script>

<template>
    <Head :title="`View Service - ${props.service.name}`" />

    <div class="mx-auto max-w-3xl space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-text">{{ props.service.name }}</h1>
                <p class="text-sm text-text-muted">Service details and configuration.</p>
            </div>
            <div class="flex gap-3">
                <Link href="/admin/services" class="btn-secondary">
                    Back to list
                </Link>
                <Link :href="`/admin/services/${props.service.id}/edit`" class="btn-primary">
                    Edit service
                </Link>
            </div>
        </div>

        <div class="card p-0">
            <dl class="divide-y divide-border">
                <div class="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-4">
                    <dt class="font-medium text-text-muted">Service name</dt>
                    <dd class="text-text sm:col-span-2">{{ props.service.name }}</dd>
                </div>
                
                <div class="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-4 bg-surface-subtle">
                    <dt class="font-medium text-text-muted">URL slug</dt>
                    <dd class="text-text sm:col-span-2">{{ props.service.slug || 'N/A' }}</dd>
                </div>

                <div class="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-4">
                    <dt class="font-medium text-text-muted">Description</dt>
                    <dd class="text-text sm:col-span-2">{{ props.service.description || 'No description provided.' }}</dd>
                </div>

                <div class="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-4 bg-surface-subtle">
                    <dt class="font-medium text-text-muted">Price</dt>
                    <dd class="font-medium text-text sm:col-span-2">{{ formatPrice(props.service.price) }}</dd>
                </div>

                <div class="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-4">
                    <dt class="font-medium text-text-muted">Duration</dt>
                    <dd class="text-text sm:col-span-2">{{ props.service.duration_minutes }} minutes</dd>
                </div>

                <div class="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-4 bg-surface-subtle">
                    <dt class="font-medium text-text-muted">Status</dt>
                    <dd class="sm:col-span-2">
                        <span class="status-indicator" :class="{
                            'status-active': props.service.status === 'active',
                            'status-pending': props.service.status === 'inactive'
                        }">
                            {{ props.service.status.charAt(0).toUpperCase() + props.service.status.slice(1) }}
                        </span>
                    </dd>
                </div>
                
                <div class="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-4">
                    <dt class="font-medium text-text-muted">Date created</dt>
                    <dd class="text-text sm:col-span-2">{{ new Date(props.service.created_at).toLocaleString() }}</dd>
                </div>
            </dl>
        </div>

        <div class="flex justify-end pt-4">
            <button 
                type="button" 
                class="btn-danger" 
                :disabled="isDeleting"
                @click="handleDelete"
            >
                {{ isDeleting ? 'Deleting...' : 'Delete Service' }}
            </button>
        </div>
    </div>
</template>
