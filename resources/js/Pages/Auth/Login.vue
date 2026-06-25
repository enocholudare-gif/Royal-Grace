<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import AuthAlert from '../../Components/Auth/AuthAlert.vue';
import AuthCard from '../../Components/Auth/AuthCard.vue';
import AuthInput from '../../Components/Auth/AuthInput.vue';
import AuthPasswordInput from '../../Components/Auth/AuthPasswordInput.vue';
import GuestLayout from '../../Layouts/GuestLayout.vue';
import { ref } from 'vue';

defineOptions({ layout: GuestLayout });

const form = useForm({
    email: '',
    password: '',
    device_name: 'web',
});

const message = ref('');
const messageTone = ref('info');

const handleSubmit = () => {
    form.post('/login', {
        onError: () => {
            if (form.errors.email) {
                messageTone.value = 'danger';
                message.value = form.errors.email;
            } else {
                messageTone.value = 'danger';
                message.value = 'Invalid credentials. Please try again.';
            }
        },
        onSuccess: () => {
            // Success is handled by Inertia redirect
        }
    });
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
                :error="form.errors.email"
            />

            <AuthPasswordInput
                id="login-password"
                v-model="form.password"
                label="Password"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
                :error="form.errors.password"
            />

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/forgot-password" class="btn-link">
                    Forgot your password?
                </Link>

                <button type="submit" class="btn-primary" :disabled="form.processing">
                    {{ form.processing ? 'Signing in...' : 'Sign in' }}
                </button>
            </div>
        </form>

        <div class="rounded-2xl border border-border bg-surface-subtle px-4 py-4 text-sm text-text-muted">
            New to Royal Grace?
            <Link href="/register" class="font-semibold text-brand-700">Create an account</Link>
        </div>
    </AuthCard>
</template>
