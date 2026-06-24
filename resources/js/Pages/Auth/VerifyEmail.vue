<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';
import axios from 'axios';
import AuthAlert from '../../Components/Auth/AuthAlert.vue';
import AuthCard from '../../Components/Auth/AuthCard.vue';
import { useApiForm } from '../../Composables/useApiForm';
import GuestLayout from '../../Layouts/GuestLayout.vue';

defineOptions({ layout: GuestLayout });

const page = usePage();
const query = new URLSearchParams(page.url.split('?')[1] || '');

const verifyUrl = query.get('verify_url') || query.get('url') || '';
const verificationId = query.get('id') || '';
const verificationHash = query.get('hash') || '';
const verificationExpires = query.get('expires') || '';
const verificationSignature = query.get('signature') || '';

const { processing, message, messageTone, setMessage } = useApiForm();

const verifyEmail = async () => {
    try {
        let response;

        if (verifyUrl) {
            response = await axios.get(verifyUrl, {
                headers: {
                    Accept: 'application/json',
                    Authorization: localStorage.getItem('auth_token')
                        ? `Bearer ${localStorage.getItem('auth_token')}`
                        : undefined,
                },
            });
        } else if (verificationId && verificationHash) {
            response = await axios.get(
                `/email/verify?id=${verificationId}&hash=${verificationHash}&expires=${verificationExpires}&signature=${verificationSignature}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: localStorage.getItem('auth_token')
                            ? `Bearer ${localStorage.getItem('auth_token')}`
                            : undefined,
                    },
                },
            );
        } else {
            setMessage(
                'Your account has been created. Please use the email verification link sent to your inbox.',
                'info',
            );

            return;
        }

        setMessage(response.data?.message || 'Email verification successful.', 'success');
    } catch (error) {
        setMessage(
            error.response?.data?.message || 'We could not verify your email automatically. Please use the link from your inbox.',
            'danger',
        );
    }
};
</script>

<template>
    <Head title="Verify Email" />

    <AuthCard
        title="Verify your email"
        subtitle="Protect your account by confirming your email address before continuing."
    >
        <AuthAlert
            v-if="message"
            :tone="messageTone"
            title="Verification status"
            :message="message"
        />

        <div class="space-y-4 rounded-2xl border border-border bg-surface-subtle p-5">
            <p class="text-sm text-text-muted">
                Click the button below if you arrived here directly from a verification link, or check your inbox for the email we sent after registration.
            </p>

            <button type="button" class="btn-primary" :disabled="processing" @click="verifyEmail">
                {{ processing ? 'Verifying...' : 'Verify email now' }}
            </button>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/login" class="btn-link">
                Back to login
            </Link>

            <Link href="/register" class="btn-secondary btn-sm">
                Create another account
            </Link>
        </div>
    </AuthCard>
</template>
