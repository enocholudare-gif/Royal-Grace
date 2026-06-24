<script setup>
defineProps({
    title: {
        type: String,
        default: '',
    },
    subtitle: {
        type: String,
        default: '',
    },
});
</script>

<template>
    <div class="space-y-6">
        <div class="space-y-2">
            <h2 class="text-2xl font-semibold text-text">{{ title }}</h2>
            <p v-if="subtitle" class="text-sm text-text-muted">
                {{ subtitle }}
            </p>
        </div>

        <slot />
    </div>
</template>
