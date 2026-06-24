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
        type: [String, Number],
        default: '',
    },
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: '',
    },
    error: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: false,
    },
    autocomplete: {
        type: String,
        default: '',
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

const inputClass = computed(() => [
    'form-input',
    props.error ? 'border-danger-300 focus:border-danger-500' : '',
]);
</script>

<template>
    <div class="form-group">
        <label :for="id" class="form-label" :class="{ 'form-required': required }">
            {{ label }}
        </label>

        <input
            :id="id"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :disabled="disabled"
            :class="inputClass"
            @input="emit('update:modelValue', $event.target.value)"
        />

        <p v-if="help && !error" class="form-help">{{ help }}</p>
        <p v-if="error" class="form-error">{{ error }}</p>
    </div>
</template>
