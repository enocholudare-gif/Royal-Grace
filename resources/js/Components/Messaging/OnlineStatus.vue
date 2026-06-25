<script setup>
import { computed } from 'vue';

const props = defineProps({
    user: { type: Object, default: null }
});

// Since realtime presence isn't fully implemented in the backend yet,
// we use a mocked or offline default. Once Laravel Reverb presence channels 
// are wired up, this can dynamically react.
const isOnline = computed(() => {
    // Check if user is in the online users set (managed by Echo presence channel)
    // For now we default to offline
    return false;
});
</script>

<template>
    <span
        class="block h-3 w-3 rounded-full border-2 border-white shadow-sm"
        :class="isOnline ? 'bg-emerald-500' : 'bg-gray-400'"
        :title="isOnline ? 'Online' : 'Offline'"
    />
</template>
