<script setup>
defineProps({
    services: {
        type: Array,
        default: () => [],
    },
    selectedServiceId: {
        type: [String, Number, null],
        default: null,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['select']);

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
</script>

<template>
    <div class="grid gap-4 lg:grid-cols-2">
        <button
            v-for="service in services"
            :key="service.id"
            type="button"
            class="card text-left transition hover:border-brand-300 hover:shadow-md"
            :class="Number(selectedServiceId) === Number(service.id) ? 'border-brand-300 ring-2 ring-brand-100' : ''"
            @click="emit('select', service)"
        >
            <div class="card-body space-y-4">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-semibold text-text">{{ service.name }}</h3>
                        <p class="mt-1 text-sm text-text-muted">{{ service.description || 'No description provided.' }}</p>
                    </div>

                    <span
                        class="status-indicator"
                        :class="String(service.status).toLowerCase() === 'active' ? 'status-active' : 'status-warning'"
                    >
                        {{ service.status }}
                    </span>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                    <div class="rounded-xl bg-surface-subtle px-4 py-3">
                        <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Price</p>
                        <p class="mt-2 text-sm font-semibold text-text">{{ formatCurrency(service.price) }}</p>
                    </div>

                    <div class="rounded-xl bg-surface-subtle px-4 py-3">
                        <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Duration</p>
                        <p class="mt-2 text-sm font-semibold text-text">{{ service.duration_minutes }} minutes</p>
                    </div>
                </div>
            </div>
        </button>

        <div v-if="loading" class="card lg:col-span-2">
            <div class="card-body text-sm text-text-muted">Loading services...</div>
        </div>

        <div v-if="!loading && services.length === 0" class="card lg:col-span-2">
            <div class="card-body text-sm text-text-muted">No services available yet.</div>
        </div>
    </div>
</template>
