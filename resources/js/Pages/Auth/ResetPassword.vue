<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';
import AuthAlert from '../../Components/Auth/AuthAlert.vue';
import AuthCard from '../../Components/Auth/AuthCard.vue';
import AuthInput from '../../Components/Auth/AuthInput.vue';
import AuthPasswordInput from '../../Components/Auth/AuthPasswordInput.vue';
import { useApiForm } from '../../Composables/useApiForm';
import GuestLayout from '../../Layouts/GuestLayout.vue';

defineOptions({ layout: GuestLayout });

const page = usePage();
const query = new URLSearchParams(page.url.split('?')[1] || '');

const { form, processing, message, messageTone, submit, setMessage, errorFor } = useApiForm({
    token: query.get('token') || '',
    email: query.get('email') || '',
    password: '',
    password_confirmation: '',
});

const handleSubmit = async () => {
    try {
        const response = await submit({
            url: '/reset-password',
            method: 'post',
        });

        setMessage(response.data?.message || 'Password reset successful.', 'success');
    } catch (error) {
        if (error.response?.status === 422) {
            setMessage('Please correct the highlighted fields and try again.', 'danger');
        }
    }
};
</script>

<template>
    <Head title="Reset Password" />

    <AuthCard
        title="Reset your password"
        subtitle="Create a new secure password to continue using your account."
    >
        <AuthAlert
            v-if="message"
            :tone="messageTone"
            title="Password reset"
            :message="message"
        />

        <form class="space-y-5" @submit.prevent="handleSubmit">
            <AuthInput
                id="reset-token"
                v-model="form.token"
                label="Reset token"
                placeholder="Paste token from email"
                required
                :error="errorFor('token')"
            />

            <AuthInput
                id="reset-email"
                v-model="form.email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
                :error="errorFor('email')"
            />

            <AuthPasswordInput
                id="reset-password"
                v-model="form.password"
                label="New password"
                placeholder="Enter a new password"
                autocomplete="new-password"
                required
                :error="errorFor('password')"
            />

            <AuthPasswordInput
                id="reset-password-confirmation"
                v-model="form.password_confirmation"
                label="Confirm new password"
                placeholder="Repeat your new password"
                autocomplete="new-password"
                required
                :error="errorFor('password_confirmation')"
            />

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/login" class="btn-link">
                    Back to login
                </Link>

                <button type="submit" class="btn-primary" :disabled="processing">
                    {{ processing ? 'Resetting...' : 'Reset password' }}
                </button>
            </div>
        </form>
    </AuthCard>
</template>
