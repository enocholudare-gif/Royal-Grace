<script setup>
import { useForm } from '@inertiajs/vue3';

const props = defineProps({
    visitReport: { type: Object, required: true },
    submitUrl: { type: String, required: true },
    draftUrl: { type: String, default: null },
});

const form = useForm({
    services_performed: props.visitReport?.services_performed ?? '',
    observations: props.visitReport?.observations ?? '',
    client_condition: props.visitReport?.client_condition ?? '',
    notes: props.visitReport?.notes ?? '',
});

const submit = () => {
    form.post(props.submitUrl);
};

const clientConditionOptions = [
    'Stable and comfortable',
    'Improvement noted',
    'No significant change',
    'Mild discomfort reported',
    'Requires additional attention',
    'Emergency – contacted supervisor',
];
</script>

<template>
    <form class="space-y-6" @submit.prevent="submit">
        <!-- Services Performed -->
        <div>
            <label class="mb-1.5 block text-sm font-medium text-text" for="services_performed">
                Services Performed <span class="text-red-500">*</span>
            </label>
            <textarea
                id="services_performed"
                v-model="form.services_performed"
                rows="4"
                class="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text placeholder:text-text-soft focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition"
                placeholder="Describe all services provided during this visit (e.g., personal hygiene, medication assistance, mobility support)…"
                required
            />
            <p v-if="form.errors.services_performed" class="mt-1 text-xs text-red-600">
                {{ form.errors.services_performed }}
            </p>
        </div>

        <!-- Client Condition -->
        <div>
            <label class="mb-1.5 block text-sm font-medium text-text" for="client_condition">
                Client Condition <span class="text-red-500">*</span>
            </label>
            <select
                id="client_condition"
                v-model="form.client_condition"
                class="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition"
                required
            >
                <option value="">Select client condition…</option>
                <option v-for="opt in clientConditionOptions" :key="opt" :value="opt">
                    {{ opt }}
                </option>
            </select>
            <p v-if="form.errors.client_condition" class="mt-1 text-xs text-red-600">
                {{ form.errors.client_condition }}
            </p>
        </div>

        <!-- Observations -->
        <div>
            <label class="mb-1.5 block text-sm font-medium text-text" for="observations">
                Observations
            </label>
            <textarea
                id="observations"
                v-model="form.observations"
                rows="3"
                class="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text placeholder:text-text-soft focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition"
                placeholder="Note any changes in the client's health, behaviour, or mood…"
            />
            <p v-if="form.errors.observations" class="mt-1 text-xs text-red-600">
                {{ form.errors.observations }}
            </p>
        </div>

        <!-- Notes -->
        <div>
            <label class="mb-1.5 block text-sm font-medium text-text" for="notes">
                Additional Notes
            </label>
            <textarea
                id="notes"
                v-model="form.notes"
                rows="3"
                class="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text placeholder:text-text-soft focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition"
                placeholder="Any important information for the next caregiver or supervisor…"
            />
            <p v-if="form.errors.notes" class="mt-1 text-xs text-red-600">
                {{ form.errors.notes }}
            </p>
        </div>

        <!-- Submit -->
        <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
                type="submit"
                class="btn-primary inline-flex items-center justify-center gap-2"
                :disabled="form.processing"
            >
                <svg v-if="form.processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ form.processing ? 'Submitting…' : 'Submit Visit Report' }}
            </button>
        </div>
    </form>
</template>
