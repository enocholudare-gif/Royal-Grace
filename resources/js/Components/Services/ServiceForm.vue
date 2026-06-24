<script setup>
import AuthInput from '../Auth/AuthInput.vue';
import AuthSelect from '../Auth/AuthSelect.vue';

defineProps({
    form: {
        type: Object,
        required: true,
    },
    errors: {
        type: Object,
        required: true,
    },
    processing: {
        type: Boolean,
        default: false,
    },
    submitLabel: {
        type: String,
        default: 'Save Service',
    },
});

const emit = defineEmits(['update:form', 'submit']);

const patchField = (field, value) => {
    emit('update:form', {
        ...arguments[0],
    });
};
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div>
                <p class="card-title">Service details</p>
                <p class="card-subtitle">Define pricing, duration, and current service status.</p>
            </div>
        </div>

        <div class="card-body">
            <form class="space-y-5" @submit.prevent="emit('submit')">
                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="service-name"
                        :model-value="form.name"
                        label="Service name"
                        placeholder="Personal Care Support"
                        required
                        :error="errors.name"
                        @update:model-value="emit('update:form', { ...form, name: $event })"
                    />

                    <AuthInput
                        id="service-slug"
                        :model-value="form.slug"
                        label="Slug"
                        placeholder="personal-care-support"
                        :error="errors.slug"
                        @update:model-value="emit('update:form', { ...form, slug: $event })"
                    />
                </div>

                <AuthInput
                    id="service-description"
                    :model-value="form.description"
                    label="Description"
                    placeholder="Describe what this service covers."
                    :error="errors.description"
                    @update:model-value="emit('update:form', { ...form, description: $event })"
                />

                <div class="grid gap-5 md:grid-cols-3">
                    <AuthInput
                        id="service-price"
                        :model-value="form.price"
                        label="Price"
                        type="number"
                        placeholder="0"
                        required
                        :error="errors.price"
                        @update:model-value="emit('update:form', { ...form, price: $event })"
                    />

                    <AuthInput
                        id="service-duration"
                        :model-value="form.duration_minutes"
                        label="Duration (minutes)"
                        type="number"
                        placeholder="60"
                        required
                        :error="errors.duration_minutes"
                        @update:model-value="emit('update:form', { ...form, duration_minutes: $event })"
                    />

                    <AuthSelect
                        id="service-status"
                        :model-value="form.status"
                        label="Status"
                        :options="[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                        ]"
                        :error="errors.status"
                        @update:model-value="emit('update:form', { ...form, status: $event })"
                    />
                </div>

                <div class="flex justify-end">
                    <button type="submit" class="btn-primary" :disabled="processing">
                        {{ processing ? 'Saving...' : submitLabel }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
