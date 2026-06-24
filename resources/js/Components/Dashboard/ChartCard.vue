<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    series: {
        type: Array,
        default: () => [],
    },
    colorClass: {
        type: String,
        default: 'text-brand-600',
    },
});

const maxValue = computed(() => {
    const values = props.series.map((item) => Number(item.value || 0));
    return Math.max(...values, 1);
});
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div>
                <p class="card-title">{{ title }}</p>
                <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
            </div>
        </div>

        <div class="card-body">
            <div class="flex h-64 items-end gap-3">
                <div
                    v-for="item in series"
                    :key="item.label"
                    class="flex min-w-0 flex-1 flex-col items-center gap-3"
                >
                    <div class="flex h-52 w-full items-end">
                        <div class="w-full rounded-t-2xl bg-secondary-100">
                            <div
                                class="w-full rounded-t-2xl transition-all duration-300"
                                :class="colorClass"
                                :style="{ height: `${Math.max((Number(item.value || 0) / maxValue) * 100, 6)}%`, backgroundColor: 'currentColor' }"
                            />
                        </div>
                    </div>

                    <div class="text-center">
                        <p class="text-sm font-semibold text-text">{{ item.value }}</p>
                        <p class="truncate text-xs text-text-soft">{{ item.label }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
