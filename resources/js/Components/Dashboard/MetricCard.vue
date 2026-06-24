<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
    value: {
        type: [String, Number],
        required: true,
    },
    change: {
        type: String,
        default: '',
    },
    trend: {
        type: String,
        default: 'up',
    },
    tone: {
        type: String,
        default: 'primary',
    },
});

const toneMap = {
    primary: 'bg-brand-100 text-brand-800',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    danger: 'bg-danger-100 text-danger-700',
    info: 'bg-info-100 text-info-700',
};
</script>

<template>
    <div class="metric-card">
        <div class="flex items-start justify-between gap-4">
            <p class="metric-label">{{ label }}</p>
            <span class="badge" :class="toneMap[tone] || toneMap.primary">
                {{ tone }}
            </span>
        </div>

        <p class="metric-value">{{ value }}</p>

        <p
            v-if="change"
            :class="trend === 'down' ? 'metric-trend-down' : 'metric-trend-up'"
        >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path
                    :d="trend === 'down' ? 'm7 7 10 10M7 17h10V7' : 'm7 17 10-10M7 7h10v10'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
            {{ change }}
        </p>
    </div>
</template>
