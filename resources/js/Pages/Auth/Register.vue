<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import axios from 'axios';
import AuthAlert from '../../Components/Auth/AuthAlert.vue';
import AuthCard from '../../Components/Auth/AuthCard.vue';
import AuthCheckbox from '../../Components/Auth/AuthCheckbox.vue';
import AuthInput from '../../Components/Auth/AuthInput.vue';
import AuthPasswordInput from '../../Components/Auth/AuthPasswordInput.vue';
import AuthSelect from '../../Components/Auth/AuthSelect.vue';
import { useApiForm } from '../../Composables/useApiForm';
import GuestLayout from '../../Layouts/GuestLayout.vue';

defineOptions({ layout: GuestLayout });

const roleOptions = [
    { value: 'client', label: 'Client' },
    { value: 'family-member', label: 'Family Member' },
    { value: 'caregiver', label: 'Caregiver' },
];

const { form, processing, message, messageTone, submit, setMessage, errorFor } = useApiForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: '',
    device_name: 'web',
    client: {
        date_of_birth: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Nigeria',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        care_notes: '',
        mobility_notes: '',
        medical_notes: '',
    },
    family_member: {
        client_id: '',
        relationship_type: '',
        can_view_bookings: true,
        can_view_reports: true,
        can_view_invoices: true,
        can_receive_notifications: true,
    },
    caregiver: {
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Nigeria',
        certifications: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        bio: '',
    },
});

const handleSubmit = async () => {
    const payload = structuredClone(form);

    if (payload.caregiver?.certifications) {
        payload.caregiver.certifications = payload.caregiver.certifications
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    } else {
        payload.caregiver.certifications = [];
    }

    if (payload.family_member?.client_id === '') {
        payload.family_member.client_id = null;
    }

    try {
        const response = await submit({
            url: '/register',
            method: 'post',
            data: payload,
        });

        const { token, message: successMessage } = response.data;

        if (token) {
            localStorage.setItem('auth_token', token);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }

        localStorage.setItem('auth_flash_success', successMessage || 'Registration successful.');
        router.visit('/email/verify');
    } catch (error) {
        if (error.response?.status === 422) {
            setMessage('Please correct the highlighted fields and try again.', 'danger');
        }
    }
};
</script>

<template>
    <Head title="Register" />

    <AuthCard
        title="Create your account"
        subtitle="Join Royal Grace to access coordinated care, family visibility, and secure communication."
    >
        <AuthAlert
            v-if="message"
            :tone="messageTone"
            title="Registration update"
            :message="message"
        />

        <form class="space-y-6" @submit.prevent="handleSubmit">
            <div class="grid gap-5 md:grid-cols-2">
                <AuthInput
                    id="register-first-name"
                    v-model="form.first_name"
                    label="First name"
                    placeholder="Olayinka"
                    autocomplete="given-name"
                    required
                    :error="errorFor('first_name')"
                />

                <AuthInput
                    id="register-last-name"
                    v-model="form.last_name"
                    label="Last name"
                    placeholder="Adewale"
                    autocomplete="family-name"
                    required
                    :error="errorFor('last_name')"
                />
            </div>

            <div class="grid gap-5 md:grid-cols-2">
                <AuthInput
                    id="register-email"
                    v-model="form.email"
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    required
                    :error="errorFor('email')"
                />

                <AuthInput
                    id="register-phone"
                    v-model="form.phone"
                    label="Phone number"
                    type="tel"
                    placeholder="+234..."
                    autocomplete="tel"
                    :error="errorFor('phone')"
                />
            </div>

            <div class="grid gap-5 md:grid-cols-2">
                <AuthSelect
                    id="register-role"
                    v-model="form.role"
                    label="Account type"
                    :options="roleOptions"
                    required
                    :error="errorFor('role')"
                />

                <AuthInput
                    id="register-device-name"
                    v-model="form.device_name"
                    label="Device name"
                    placeholder="Web browser"
                    :error="errorFor('device_name')"
                />
            </div>

            <div class="grid gap-5 md:grid-cols-2">
                <AuthPasswordInput
                    id="register-password"
                    v-model="form.password"
                    label="Password"
                    placeholder="Create a strong password"
                    autocomplete="new-password"
                    required
                    help="Minimum 8 characters."
                    :error="errorFor('password')"
                />

                <AuthPasswordInput
                    id="register-password-confirmation"
                    v-model="form.password_confirmation"
                    label="Confirm password"
                    placeholder="Repeat your password"
                    autocomplete="new-password"
                    required
                    :error="errorFor('password_confirmation')"
                />
            </div>

            <section v-if="form.role === 'client'" class="form-section">
                <div>
                    <h3 class="text-lg font-semibold text-text">Client profile</h3>
                    <p class="text-sm text-text-muted">Tell us about the care recipient so bookings and care coordination can start smoothly.</p>
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="client-date-of-birth"
                        v-model="form.client.date_of_birth"
                        label="Date of birth"
                        type="date"
                        :error="errorFor('client.date_of_birth')"
                    />

                    <AuthInput
                        id="client-emergency-contact-name"
                        v-model="form.client.emergency_contact_name"
                        label="Emergency contact name"
                        placeholder="Primary emergency contact"
                        :error="errorFor('client.emergency_contact_name')"
                    />
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="client-address-line-1"
                        v-model="form.client.address_line_1"
                        label="Address line 1"
                        required
                        :error="errorFor('client.address_line_1')"
                    />

                    <AuthInput
                        id="client-address-line-2"
                        v-model="form.client.address_line_2"
                        label="Address line 2"
                        :error="errorFor('client.address_line_2')"
                    />
                </div>

                <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <AuthInput id="client-city" v-model="form.client.city" label="City" required :error="errorFor('client.city')" />
                    <AuthInput id="client-state" v-model="form.client.state" label="State" required :error="errorFor('client.state')" />
                    <AuthInput id="client-postal-code" v-model="form.client.postal_code" label="Postal code" required :error="errorFor('client.postal_code')" />
                    <AuthInput id="client-country" v-model="form.client.country" label="Country" required :error="errorFor('client.country')" />
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="client-emergency-contact-phone"
                        v-model="form.client.emergency_contact_phone"
                        label="Emergency contact phone"
                        :error="errorFor('client.emergency_contact_phone')"
                    />

                    <AuthInput
                        id="client-care-notes"
                        v-model="form.client.care_notes"
                        label="Care notes"
                        placeholder="Brief care requirements"
                        :error="errorFor('client.care_notes')"
                    />
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="client-mobility-notes"
                        v-model="form.client.mobility_notes"
                        label="Mobility notes"
                        :error="errorFor('client.mobility_notes')"
                    />

                    <AuthInput
                        id="client-medical-notes"
                        v-model="form.client.medical_notes"
                        label="Medical notes"
                        :error="errorFor('client.medical_notes')"
                    />
                </div>
            </section>

            <section v-if="form.role === 'family-member'" class="form-section">
                <div>
                    <h3 class="text-lg font-semibold text-text">Family access details</h3>
                    <p class="text-sm text-text-muted">Link this account to an existing client record and define the visibility level.</p>
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="family-client-id"
                        v-model="form.family_member.client_id"
                        label="Client ID"
                        type="number"
                        required
                        help="Use the client ID provided by an admin."
                        :error="errorFor('family_member.client_id')"
                    />

                    <AuthInput
                        id="family-relationship-type"
                        v-model="form.family_member.relationship_type"
                        label="Relationship"
                        placeholder="Son, Daughter, Spouse..."
                        required
                        :error="errorFor('family_member.relationship_type')"
                    />
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                    <AuthCheckbox
                        id="family-can-view-bookings"
                        v-model="form.family_member.can_view_bookings"
                        label="Can view bookings"
                    />
                    <AuthCheckbox
                        id="family-can-view-reports"
                        v-model="form.family_member.can_view_reports"
                        label="Can view reports"
                    />
                    <AuthCheckbox
                        id="family-can-view-invoices"
                        v-model="form.family_member.can_view_invoices"
                        label="Can view invoices"
                    />
                    <AuthCheckbox
                        id="family-can-receive-notifications"
                        v-model="form.family_member.can_receive_notifications"
                        label="Can receive notifications"
                    />
                </div>
            </section>

            <section v-if="form.role === 'caregiver'" class="form-section">
                <div>
                    <h3 class="text-lg font-semibold text-text">Caregiver profile</h3>
                    <p class="text-sm text-text-muted">Add profile and compliance details needed for caregiver onboarding.</p>
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="caregiver-address-line-1"
                        v-model="form.caregiver.address_line_1"
                        label="Address line 1"
                        required
                        :error="errorFor('caregiver.address_line_1')"
                    />

                    <AuthInput
                        id="caregiver-address-line-2"
                        v-model="form.caregiver.address_line_2"
                        label="Address line 2"
                        :error="errorFor('caregiver.address_line_2')"
                    />
                </div>

                <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <AuthInput id="caregiver-city" v-model="form.caregiver.city" label="City" required :error="errorFor('caregiver.city')" />
                    <AuthInput id="caregiver-state" v-model="form.caregiver.state" label="State" required :error="errorFor('caregiver.state')" />
                    <AuthInput id="caregiver-postal-code" v-model="form.caregiver.postal_code" label="Postal code" required :error="errorFor('caregiver.postal_code')" />
                    <AuthInput id="caregiver-country" v-model="form.caregiver.country" label="Country" required :error="errorFor('caregiver.country')" />
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="caregiver-emergency-contact-name"
                        v-model="form.caregiver.emergency_contact_name"
                        label="Emergency contact name"
                        required
                        :error="errorFor('caregiver.emergency_contact_name')"
                    />

                    <AuthInput
                        id="caregiver-emergency-contact-phone"
                        v-model="form.caregiver.emergency_contact_phone"
                        label="Emergency contact phone"
                        required
                        :error="errorFor('caregiver.emergency_contact_phone')"
                    />
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="caregiver-certifications"
                        v-model="form.caregiver.certifications"
                        label="Certifications"
                        placeholder="CPR, Geriatric Care, First Aid"
                        help="Separate multiple certifications with commas."
                        :error="errorFor('caregiver.certifications')"
                    />

                    <AuthInput
                        id="caregiver-bio"
                        v-model="form.caregiver.bio"
                        label="Short bio"
                        placeholder="Experience, specialties, and care approach"
                        :error="errorFor('caregiver.bio')"
                    />
                </div>
            </section>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/login" class="btn-link">
                    Already have an account?
                </Link>

                <button type="submit" class="btn-primary" :disabled="processing">
                    {{ processing ? 'Creating account...' : 'Create account' }}
                </button>
            </div>
        </form>
    </AuthCard>
</template>
