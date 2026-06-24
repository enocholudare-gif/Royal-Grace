<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import AuthAlert from '../../../Components/Auth/AuthAlert.vue';
import AuthInput from '../../../Components/Auth/AuthInput.vue';
import AuthPasswordInput from '../../../Components/Auth/AuthPasswordInput.vue';
import { useApiForm } from '../../../Composables/useApiForm';
import AdminLayout from '../../../Layouts/AdminLayout.vue';

defineOptions({ layout: AdminLayout });

const { form, processing, message, messageTone, submit, errorFor } = useApiForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Nigeria', // default
    emergency_contact_name: '',
    emergency_contact_phone: '',
    bio: '',
    status: 'active',
});

const handleSubmit = async () => {
    try {
        await submit({
            url: '/caregivers',
            method: 'post',
        });
        localStorage.setItem('auth_flash_success', 'Caregiver created successfully.');
        router.visit('/admin/caregivers');
    } catch (e) {
        // Error is handled by useApiForm
    }
};
</script>

<template>
    <Head title="Add Caregiver" />

    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <Link href="/admin/caregivers" class="mb-1 inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Back to Caregivers
                </Link>
                <h1 class="text-2xl font-bold tracking-tight text-text">Add Caregiver</h1>
                <p class="mt-1 text-sm text-text-muted">
                    Create a new caregiver profile and set up their login credentials.
                </p>
            </div>
        </div>

        <AuthAlert
            v-if="message"
            :tone="messageTone"
            title="Update"
            :message="message"
        />

        <form class="space-y-6" @submit.prevent="handleSubmit">
            
            <div class="form-section">
                <h2 class="text-lg font-semibold text-text">Personal Details</h2>
                <div class="grid gap-5 sm:grid-cols-2">
                    <AuthInput
                        id="cg-firstname"
                        v-model="form.first_name"
                        label="First Name"
                        placeholder="Jane"
                        required
                        :error="errorFor('first_name')"
                    />
                    <AuthInput
                        id="cg-lastname"
                        v-model="form.last_name"
                        label="Last Name"
                        placeholder="Doe"
                        required
                        :error="errorFor('last_name')"
                    />
                    <AuthInput
                        id="cg-email"
                        v-model="form.email"
                        label="Email Address"
                        type="email"
                        placeholder="jane@example.com"
                        required
                        :error="errorFor('email')"
                    />
                    <AuthInput
                        id="cg-phone"
                        v-model="form.phone"
                        label="Phone Number"
                        placeholder="+234..."
                        :error="errorFor('phone')"
                    />
                    <AuthPasswordInput
                        id="cg-password"
                        v-model="form.password"
                        label="Password"
                        placeholder="Temporary password"
                        required
                        :error="errorFor('password')"
                        help="The caregiver will use this to log in."
                    />
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select v-model="form.status" class="form-select">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        <p v-if="errorFor('status')" class="form-error mt-1">{{ errorFor('status') }}</p>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="text-lg font-semibold text-text">Address Information</h2>
                <div class="grid gap-5 sm:grid-cols-2">
                    <AuthInput
                        id="cg-address1"
                        v-model="form.address_line_1"
                        label="Address Line 1"
                        required
                        :error="errorFor('address_line_1')"
                        class="sm:col-span-2"
                    />
                    <AuthInput
                        id="cg-address2"
                        v-model="form.address_line_2"
                        label="Address Line 2 (Optional)"
                        :error="errorFor('address_line_2')"
                        class="sm:col-span-2"
                    />
                    <AuthInput
                        id="cg-city"
                        v-model="form.city"
                        label="City"
                        required
                        :error="errorFor('city')"
                    />
                    <AuthInput
                        id="cg-state"
                        v-model="form.state"
                        label="State"
                        required
                        :error="errorFor('state')"
                    />
                    <AuthInput
                        id="cg-postal"
                        v-model="form.postal_code"
                        label="Postal Code"
                        required
                        :error="errorFor('postal_code')"
                    />
                    <AuthInput
                        id="cg-country"
                        v-model="form.country"
                        label="Country"
                        required
                        :error="errorFor('country')"
                    />
                </div>
            </div>

            <div class="form-section">
                <h2 class="text-lg font-semibold text-text">Emergency Contact</h2>
                <div class="grid gap-5 sm:grid-cols-2">
                    <AuthInput
                        id="cg-em-name"
                        v-model="form.emergency_contact_name"
                        label="Contact Name"
                        required
                        :error="errorFor('emergency_contact_name')"
                    />
                    <AuthInput
                        id="cg-em-phone"
                        v-model="form.emergency_contact_phone"
                        label="Contact Phone"
                        required
                        :error="errorFor('emergency_contact_phone')"
                    />
                </div>
            </div>

            <div class="form-section">
                <h2 class="text-lg font-semibold text-text">Additional Info</h2>
                <div class="form-group">
                    <label class="form-label" for="cg-bio">Bio / Notes</label>
                    <textarea
                        id="cg-bio"
                        v-model="form.bio"
                        class="form-textarea"
                        placeholder="Background info, skills, etc."
                    ></textarea>
                    <p v-if="errorFor('bio')" class="form-error mt-1">{{ errorFor('bio') }}</p>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4">
                <Link href="/admin/caregivers" class="btn-ghost">
                    Cancel
                </Link>
                <button type="submit" class="btn-primary" :disabled="processing">
                    {{ processing ? 'Saving...' : 'Save Caregiver' }}
                </button>
            </div>
        </form>
    </div>
</template>
