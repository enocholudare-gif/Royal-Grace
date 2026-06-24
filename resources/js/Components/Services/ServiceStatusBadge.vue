<script setup>
defineProps({
    status: {
        type: String,
        default: 'inactive',
    },
});
</script>

<template>
    <span
        class="status-indicator"
        :class="String(status).toLowerCase() === 'active' ? 'status-active' : 'status-warning'"
    >
        {{ status }}
    </span>
</template>
