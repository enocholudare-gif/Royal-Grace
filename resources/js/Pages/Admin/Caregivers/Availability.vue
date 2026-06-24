<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import AuthAlert from '../../../Components/Auth/AuthAlert.vue';
import AuthInput from '../../../Components/Auth/AuthInput.vue';
import { useApiForm } from '../../../Composables/useApiForm';
import AdminLayout from '../../../Layouts/AdminLayout.vue';
import axios from 'axios';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    caregiver: {
        type: Object,
        required: true,
    },
});

const { form, processing, message, messageTone, submit, errorFor } = useApiForm({
    day_of_week: 'monday',
    start_time: '09:00',
    end_time: '17:00',
    is_available: true,
});

const fetchAvailabilities = async () => {
    // Mocking or fetching actual data from caregiver object
};

const handleSubmit = async () => {
    try {
        await submit({
            url: `/caregivers/${props.caregiver.id}/availability`,
            method: 'post',
        });
        message.value = 'Availability added successfully.';
        messageTone.value = 'success';
        // reset fields if needed, or fetch data
    } catch (e) {
        // Error is handled by useApiForm
    }
};

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

</script>

<template>
    <Head title="Caregiver Availability" />

    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <Link :href="`/admin/caregivers/${caregiver.id}`" class="mb-1 inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Back to {{ caregiver.first_name }}
                </Link>
                <h1 class="text-2xl font-bold tracking-tight text-text">Availability Settings</h1>
                <p class="mt-1 text-sm text-text-muted">
                    Manage available days and hours for {{ caregiver.first_name }} {{ caregiver.last_name }}.
                </p>
            </div>
        </div>

        <AuthAlert
            v-if="message"
            :tone="messageTone"
            title="Availability Update"
            :message="message"
        />

        <div class="grid gap-6 md:grid-cols-3">
            <div class="md:col-span-1 space-y-6">
                <!-- Add Availability Form -->
                <div class="card p-6">
                    <h2 class="text-lg font-semibold text-text mb-4">Add Schedule Slot</h2>
                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <div class="form-group">
                            <label class="form-label">Day of Week</label>
                            <select v-model="form.day_of_week" class="form-select">
                                <option v-for="day in days" :key="day" :value="day">
                                    {{ day.charAt(0).toUpperCase() + day.slice(1) }}
                                </option>
                            </select>
                            <p v-if="errorFor('day_of_week')" class="form-error mt-1">{{ errorFor('day_of_week') }}</p>
                        </div>
                        
                        <AuthInput
                            id="start_time"
                            v-model="form.start_time"
                            type="time"
                            label="Start Time"
                            required
                            :error="errorFor('start_time')"
                        />
                        
                        <AuthInput
                            id="end_time"
                            v-model="form.end_time"
                            type="time"
                            label="End Time"
                            required
                            :error="errorFor('end_time')"
                        />

                        <div class="pt-2">
                            <button type="submit" class="btn-primary w-full" :disabled="processing">
                                {{ processing ? 'Adding...' : 'Add Slot' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Current Schedule -->
            <div class="md:col-span-2 space-y-6">
                <div class="card p-6">
                    <h2 class="text-lg font-semibold text-text mb-4">Current Schedule</h2>
                    <div class="table-wrap">
                        <table class="table-standard">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Time Slot</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!caregiver.availabilities || caregiver.availabilities.length === 0">
                                    <td colspan="3" class="table-empty">No schedule slots configured yet.</td>
                                </tr>
                                <tr v-for="slot in caregiver.availabilities" :key="slot.id">
                                    <td class="font-medium text-text capitalize">{{ slot.day_of_week }}</td>
                                    <td>{{ slot.start_time }} - {{ slot.end_time }}</td>
                                    <td>
                                        <span class="status-indicator status-active">Available</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
