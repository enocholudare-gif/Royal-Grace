<script setup>
import { computed } from 'vue';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
        default: '',
    },
    options: {
        type: Array,
        default: () => [],
    },
    error: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);

const selectClass = computed(() => [
    'form-select',
    props.error ? 'border-danger-300 focus:border-danger-500' : '',
]);
</script>

<template>
    <div class="form-group">
        <label :for="id" class="form-label" :class="{ 'form-required': required }">
            {{ label }}
        </label>

        <select
            :id="id"
            :value="modelValue"
            :disabled="disabled"
            :class="selectClass"
            @change="emit('update:modelValue', $event.target.value)"
        >
            <option value="">Select an option</option>
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>

        <p v-if="error" class="form-error">{{ error }}</p>
    </div>
</template>
