<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AuthAlert from '../../Components/Auth/AuthAlert.vue';
import AuthCard from '../../Components/Auth/AuthCard.vue';
import AuthInput from '../../Components/Auth/AuthInput.vue';
import { useApiForm } from '../../Composables/useApiForm';
import GuestLayout from '../../Layouts/GuestLayout.vue';

defineOptions({ layout: GuestLayout });

const { form, processing, message, messageTone, submit, setMessage, errorFor } = useApiForm({
    email: '',
});

const handleSubmit = async () => {
    try {
        const response = await submit({
            url: '/forgot-password',
            method: 'post',
        });

        setMessage(response.data?.message || 'Password reset link sent successfully.', 'success');
    } catch (error) {
        if (error.response?.status === 422) {
            setMessage('Please provide a valid email address.', 'danger');
        }
    }
};
</script>

<template>
    <Head title="Forgot Password" />

    <AuthCard
        title="Forgot your password?"
        subtitle="Enter your email and we’ll send you a secure reset link."
    >
        <AuthAlert
            v-if="message"
            :tone="messageTone"
            title="Password recovery"
            :message="message"
        />

        <form class="space-y-5" @submit.prevent="handleSubmit">
            <AuthInput
                id="forgot-password-email"
                v-model="form.email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
                :error="errorFor('email')"
            />

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/login" class="btn-link">
                    Back to login
                </Link>

                <button type="submit" class="btn-primary" :disabled="processing">
                    {{ processing ? 'Sending link...' : 'Send reset link' }}
                </button>
            </div>
        </form>
    </AuthCard>
</template>
