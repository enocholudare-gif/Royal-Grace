<script setup>
defineProps({
    tone: {
        type: String,
        default: 'info',
    },
    title: {
        type: String,
        default: '',
    },
    message: {
        type: String,
        default: '',
    },
});

const toneClassMap = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    danger: 'alert-danger',
};
</script>

<template>
    <div :class="['alert', toneClassMap[tone] || toneClassMap.info]">
        <div class="mt-0.5">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 8v4m0 4h.01" stroke-linecap="round" />
                <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>

        <div class="min-w-0">
            <p v-if="title" class="font-semibold">{{ title }}</p>
            <p>{{ message }}</p>
        </div>
    </div>
</template>
