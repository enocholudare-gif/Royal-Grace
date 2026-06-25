<script setup>
import { computed } from 'vue';

const props = defineProps({
    isMine: { type: Boolean, default: false },
    status: { type: String, default: 'sent' } // sending, sent, delivered, read
});

const bubbleClasses = computed(() => {
    return props.isMine 
        ? 'bg-brand-600 text-white rounded-br-none' 
        : 'bg-surface border border-border text-text rounded-bl-none shadow-sm';
});
</script>

<template>
    <div 
        class="relative max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl break-words"
        :class="bubbleClasses"
    >
        <slot />
        
        <!-- Status indicator for my messages -->
        <div v-if="isMine" class="absolute bottom-1 right-2 flex items-center justify-end">
            <svg v-if="status === 'sending'" class="h-3 w-3 animate-spin text-brand-200" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else-if="status === 'sent'" class="h-3 w-3 text-brand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="status === 'read'" class="h-3.5 w-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7M5 18l4 4L19 12" />
            </svg>
        </div>
    </div>
</template>
