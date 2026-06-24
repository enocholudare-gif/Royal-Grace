<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import { onMounted } from 'vue';
import AuthAlert from '../../../Components/Auth/AuthAlert.vue';
import AuthInput from '../../../Components/Auth/AuthInput.vue';
import AuthSelect from '../../../Components/Auth/AuthSelect.vue';
import { useApiForm } from '../../../Composables/useApiForm';
import AdminLayout from '../../../Layouts/AdminLayout.vue';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    service: {
        type: Object,
        required: true,
    },
});

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const { form, processing, message, messageTone, submit, errorFor } = useApiForm({
    name: props.service.name || '',
    slug: props.service.slug || '',
    description: props.service.description || '',
    price: props.service.price || '',
    duration_minutes: props.service.duration_minutes || '',
    status: props.service.status || 'active',
});

const handleSubmit = async () => {
    try {
        const payload = structuredClone(form);
        if (!payload.slug) delete payload.slug;

        await submit({
            url: `/services/${props.service.id}`,
            method: 'put',
            data: payload,
        });

        localStorage.setItem('auth_flash_success', 'Service updated successfully.');
        router.visit('/admin/services');
    } catch (error) {
        // useApiForm handles errors internally
    }
};
</script>

<template>
    <Head title="Edit Service" />

    <div class="mx-auto max-w-3xl space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-text">Edit Service</h1>
                <p class="text-sm text-text-muted">Update details for {{ props.service.name }}</p>
            </div>
            <div class="flex gap-3">
                <Link :href="`/admin/services/${props.service.id}`" class="btn-secondary">
                    Cancel
                </Link>
            </div>
        </div>

        <div class="card p-6">
            <AuthAlert
                v-if="message"
                :tone="messageTone"
                title="Status update"
                :message="message"
            />

            <form class="space-y-6" @submit.prevent="handleSubmit">
                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="service-name"
                        v-model="form.name"
                        label="Service name"
                        required
                        :error="errorFor('name')"
                    />

                    <AuthInput
                        id="service-slug"
                        v-model="form.slug"
                        label="URL slug (optional)"
                        :error="errorFor('slug')"
                    />
                </div>

                <div>
                    <AuthInput
                        id="service-description"
                        v-model="form.description"
                        label="Description"
                        :error="errorFor('description')"
                    />
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="service-price"
                        v-model="form.price"
                        label="Price ($)"
                        type="number"
                        step="0.01"
                        required
                        :error="errorFor('price')"
                    />

                    <AuthInput
                        id="service-duration"
                        v-model="form.duration_minutes"
                        label="Duration (minutes)"
                        type="number"
                        required
                        :error="errorFor('duration_minutes')"
                    />
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthSelect
                        id="service-status"
                        v-model="form.status"
                        label="Status"
                        :options="statusOptions"
                        required
                        :error="errorFor('status')"
                    />
                </div>

                <div class="flex items-center justify-end border-t border-border pt-5">
                    <button type="submit" class="btn-primary" :disabled="processing">
                        {{ processing ? 'Saving...' : 'Save changes' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
