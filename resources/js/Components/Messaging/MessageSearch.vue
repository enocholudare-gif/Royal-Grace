<template>
    <div class="relative w-full">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <input 
            type="text" 
            class="block w-full rounded-xl border-none bg-surface-subtle py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-muted focus:ring-2 focus:ring-brand-500 transition shadow-inner" 
            placeholder="Search conversations..." 
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>

<script setup>
defineProps({
    modelValue: String
});
defineEmits(['update:modelValue']);
</script>
