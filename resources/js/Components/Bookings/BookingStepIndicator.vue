<script setup>
defineProps({
    steps: {
        type: Array,
        default: () => [],
    },
    currentStep: {
        type: Number,
        default: 1,
    },
});
</script>

<template>
    <div class="card">
        <div class="card-body">
            <div class="grid gap-4 md:grid-cols-7">
                <div
                    v-for="step in steps"
                    :key="step.number"
                    class="flex items-center gap-3 rounded-2xl border px-4 py-3"
                    :class="step.number === currentStep
                        ? 'border-brand-200 bg-brand-50'
                        : step.number < currentStep
                            ? 'border-success-200 bg-success-50'
                            : 'border-border bg-surface-subtle'"
                >
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                        :class="step.number === currentStep
                            ? 'bg-brand-600 text-white'
                            : step.number < currentStep
                                ? 'bg-success-600 text-white'
                                : 'bg-secondary-100 text-text-muted'"
                    >
                        {{ step.number }}
                    </div>

                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-text">{{ step.title }}</p>
                        <p class="truncate text-xs text-text-soft">{{ step.caption }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
