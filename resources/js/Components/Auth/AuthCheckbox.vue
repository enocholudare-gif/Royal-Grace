<script setup>
defineProps({
    id: {
        type: String,
        required: true,
    },
    modelValue: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        required: true,
    },
    help: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <label :for="id" class="flex items-start gap-3 rounded-xl border border-border bg-surface-subtle px-4 py-3">
        <input
            :id="id"
            :checked="modelValue"
            :disabled="disabled"
            type="checkbox"
            class="form-checkbox mt-0.5"
            @change="emit('update:modelValue', $event.target.checked)"
        />

        <span class="min-w-0">
            <span class="block text-sm font-medium text-text">{{ label }}</span>
            <span v-if="help" class="mt-1 block text-xs text-text-soft">{{ help }}</span>
        </span>
    </label>
</template>
