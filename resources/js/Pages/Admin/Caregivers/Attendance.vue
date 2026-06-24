<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import AuthAlert from '../../../Components/Auth/AuthAlert.vue';
import AuthInput from '../../../Components/Auth/AuthInput.vue';
import { useApiForm } from '../../../Composables/useApiForm';
import AdminLayout from '../../../Layouts/AdminLayout.vue';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    caregiver: {
        type: Object,
        required: true,
    },
});

const today = new Date().toISOString().split('T')[0];

const { form, processing, message, messageTone, submit, errorFor } = useApiForm({
    attendance_date: today,
    status: 'present',
    clock_in_at: '',
    clock_out_at: '',
    hours_worked: '',
    notes: '',
});

const handleSubmit = async () => {
    try {
        await submit({
            url: `/caregivers/${props.caregiver.id}/attendance`,
            method: 'post',
        });
        message.value = 'Attendance record added successfully.';
        messageTone.value = 'success';
        
        // Reset specific fields
        form.clock_in_at = '';
        form.clock_out_at = '';
        form.hours_worked = '';
        form.notes = '';
    } catch (e) {
        // Error handled
    }
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
};

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '—';
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit'
    });
};

</script>

<template>
    <Head title="Caregiver Attendance" />

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
                <h1 class="text-2xl font-bold tracking-tight text-text">Attendance Tracking</h1>
                <p class="mt-1 text-sm text-text-muted">
                    Record and view attendance history for {{ caregiver.first_name }} {{ caregiver.last_name }}.
                </p>
            </div>
        </div>

        <AuthAlert
            v-if="message"
            :tone="messageTone"
            title="Attendance Update"
            :message="message"
        />

        <div class="grid gap-6 md:grid-cols-3">
            <div class="md:col-span-1 space-y-6">
                <!-- Add Record Form -->
                <div class="card p-6">
                    <h2 class="text-lg font-semibold text-text mb-4">Add Record</h2>
                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <AuthInput
                            id="attendance_date"
                            v-model="form.attendance_date"
                            type="date"
                            label="Date"
                            required
                            :error="errorFor('attendance_date')"
                        />
                        
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select v-model="form.status" class="form-select">
                                <option value="scheduled">Scheduled</option>
                                <option value="present">Present</option>
                                <option value="late">Late</option>
                                <option value="absent">Absent</option>
                                <option value="excused">Excused</option>
                            </select>
                            <p v-if="errorFor('status')" class="form-error mt-1">{{ errorFor('status') }}</p>
                        </div>

                        <AuthInput
                            id="clock_in_at"
                            v-model="form.clock_in_at"
                            type="datetime-local"
                            label="Clock In Time (Optional)"
                            :error="errorFor('clock_in_at')"
                        />
                        
                        <AuthInput
                            id="clock_out_at"
                            v-model="form.clock_out_at"
                            type="datetime-local"
                            label="Clock Out Time (Optional)"
                            :error="errorFor('clock_out_at')"
                        />

                        <AuthInput
                            id="hours_worked"
                            v-model="form.hours_worked"
                            type="number"
                            step="0.1"
                            label="Hours Worked (Optional)"
                            :error="errorFor('hours_worked')"
                        />

                        <div class="form-group">
                            <label class="form-label" for="att-notes">Notes (Optional)</label>
                            <textarea
                                id="att-notes"
                                v-model="form.notes"
                                class="form-textarea min-h-[80px]"
                                placeholder="Reason for absence, late arrival, etc."
                            ></textarea>
                            <p v-if="errorFor('notes')" class="form-error mt-1">{{ errorFor('notes') }}</p>
                        </div>

                        <div class="pt-2">
                            <button type="submit" class="btn-primary w-full" :disabled="processing">
                                {{ processing ? 'Saving...' : 'Save Record' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Attendance History -->
            <div class="md:col-span-2 space-y-6">
                <div class="card p-6">
                    <h2 class="text-lg font-semibold text-text mb-4">Attendance History</h2>
                    <div class="table-wrap">
                        <table class="table-standard">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Clock In</th>
                                    <th>Clock Out</th>
                                    <th>Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!caregiver.attendanceRecords || caregiver.attendanceRecords.length === 0">
                                    <td colspan="5" class="table-empty">No attendance records found.</td>
                                </tr>
                                <tr v-for="record in caregiver.attendanceRecords" :key="record.id">
                                    <td class="font-medium text-text">{{ formatDate(record.attendance_date) }}</td>
                                    <td>
                                        <span class="status-indicator" :class="{
                                            'status-active': record.status === 'present',
                                            'status-warning': record.status === 'late',
                                            'status-danger': record.status === 'absent',
                                            'status-info': record.status === 'scheduled',
                                            'status-pending': record.status === 'excused',
                                        }">
                                            {{ record.status.charAt(0).toUpperCase() + record.status.slice(1) }}
                                        </span>
                                    </td>
                                    <td class="text-text-muted">{{ formatDateTime(record.clock_in_at) }}</td>
                                    <td class="text-text-muted">{{ formatDateTime(record.clock_out_at) }}</td>
                                    <td class="text-text-muted">{{ record.hours_worked ? record.hours_worked + ' hrs' : '—' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
