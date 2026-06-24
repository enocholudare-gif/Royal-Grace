<script setup>
import { computed, ref } from 'vue';

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
const showPassword = ref(false);

const inputType = computed(() => (showPassword.value ? 'text' : 'password'));
const inputClass = computed(() => [
    'form-input pr-12',
    props.error ? 'border-danger-300 focus:border-danger-500' : '',
]);
</script>

<template>
    <div class="form-group">
        <label :for="id" class="form-label" :class="{ 'form-required': required }">
            {{ label }}
        </label>

        <div class="relative">
            <input
                :id="id"
                :type="inputType"
                :value="modelValue"
                :placeholder="placeholder"
                :autocomplete="autocomplete"
                :disabled="disabled"
                :class="inputClass"
                @input="emit('update:modelValue', $event.target.value)"
            />

            <button
                type="button"
                class="absolute inset-y-0 right-0 inline-flex items-center px-4 text-sm font-medium text-text-soft"
                @click="showPassword = !showPassword"
            >
                {{ showPassword ? 'Hide' : 'Show' }}
            </button>
        </div>

        <p v-if="help && !error" class="form-help">{{ help }}</p>
        <p v-if="error" class="form-error">{{ error }}</p>
    </div>
</template>
