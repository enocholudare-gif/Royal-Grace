<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import axios from 'axios';
import AuthAlert from '../../Components/Auth/AuthAlert.vue';
import AuthCard from '../../Components/Auth/AuthCard.vue';
import AuthInput from '../../Components/Auth/AuthInput.vue';
import AuthPasswordInput from '../../Components/Auth/AuthPasswordInput.vue';
import { useApiForm } from '../../Composables/useApiForm';
import GuestLayout from '../../Layouts/GuestLayout.vue';

defineOptions({ layout: GuestLayout });

const { form, processing, message, messageTone, submit, setMessage, errorFor } = useApiForm({
    email: '',
    password: '',
    device_name: 'web',
});

const handleSubmit = async () => {
    try {
        const response = await submit({
            url: '/login',
            method: 'post',
        });

        const { token, user, message: successMessage } = response.data;

        if (token) {
            localStorage.setItem('auth_token', token);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }

        if (successMessage) {
            localStorage.setItem('auth_flash_success', successMessage);
        }

        const roleName = user?.role?.name ?? user?.primary_role?.name ?? user?.role ?? '';
        const normalizedRole = String(roleName).toLowerCase();

        if (normalizedRole.includes('super admin') || normalizedRole.includes('admin')) {
            window.location.href = '/admin/dashboard';
            return;
        }

        if (normalizedRole.includes('caregiver')) {
            window.location.href = '/caregiver/dashboard';
            return;
        }

        if (normalizedRole.includes('family')) {
            window.location.href = '/family/dashboard';
            return;
        }

        window.location.href = '/client/dashboard';
    } catch (error) {
        if (error.response?.status === 401) {
            setMessage('Invalid credentials. Please try again.', 'danger');
        }
    }
};
</script>

<template>
    <Head title="Login" />

    <AuthCard
        title="Welcome back"
        subtitle="Sign in to manage bookings, care updates, payments, and communication."
    >
        <AuthAlert
            v-if="message"
            :tone="messageTone"
            title="Authentication update"
            :message="message"
        />

        <form class="space-y-5" @submit.prevent="handleSubmit">
            <AuthInput
                id="login-email"
                v-model="form.email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
                :error="errorFor('email')"
            />

            <AuthPasswordInput
                id="login-password"
                v-model="form.password"
                label="Password"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
                :error="errorFor('password')"
            />

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/forgot-password" class="btn-link">
                    Forgot your password?
                </Link>

                <button type="submit" class="btn-primary" :disabled="processing">
                    {{ processing ? 'Signing in...' : 'Sign in' }}
                </button>
            </div>
        </form>

        <div class="rounded-2xl border border-border bg-surface-subtle px-4 py-4 text-sm text-text-muted">
            New to Royal Grace?
            <Link href="/register" class="font-semibold text-brand-700">Create an account</Link>
        </div>
    </AuthCard>
</template>
