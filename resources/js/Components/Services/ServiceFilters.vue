<script setup>
import AuthInput from '../Auth/AuthInput.vue';
import AuthSelect from '../Auth/AuthSelect.vue';

defineProps({
    filters: {
        type: Object,
        required: true,
    },
    processing: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:filters', 'submit', 'reset']);

const updateField = (field, value) => {
    emit('update:filters', {
        ...arguments[0],
    });
};
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div>
                <p class="card-title">Filters</p>
                <p class="card-subtitle">Narrow the service list by name and availability status.</p>
            </div>
        </div>

        <div class="card-body">
            <form class="grid gap-4 md:grid-cols-[1.5fr_1fr_auto_auto]" @submit.prevent="emit('submit')">
                <AuthInput
                    id="service-filter-search"
                    :model-value="filters.search"
                    label="Search"
                    placeholder="Search by service name"
                    @update:model-value="emit('update:filters', { ...filters, search: $event })"
                />

                <AuthSelect
                    id="service-filter-status"
                    :model-value="filters.status"
                    label="Status"
                    :options="[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                    ]"
                    @update:model-value="emit('update:filters', { ...filters, status: $event })"
                />

                <div class="flex items-end">
                    <button type="submit" class="btn-primary w-full" :disabled="processing">
                        {{ processing ? 'Filtering...' : 'Apply' }}
                    </button>
                </div>

                <div class="flex items-end">
                    <button type="button" class="btn-secondary w-full" @click="emit('reset')">
                        Reset
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
