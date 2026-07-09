import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import AuthCard from '../../Components/Auth/AuthCard';
import AuthInput from '../../Components/Auth/AuthInput';
import AuthPasswordInput from '../../Components/Auth/AuthPasswordInput';
import AuthAlert from '../../Components/Auth/AuthAlert';
import GuestLayout from '../../Layouts/GuestLayout';

export default function Login() {
    const { appUrl } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        device_name: 'web',
    });

    const [message, setMessage] = useState('');
    const [messageTone, setMessageTone] = useState('info');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        post(`${appUrl}/login`, {
            onSuccess: (page) => {
                const token = page.props?.token; // If token is passed via props
                if (token) {
                    localStorage.setItem('auth_token', token);
                    window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                // Rely on server-side redirect
            },
            onError: (errs) => {
                if (errs.email) {
                    setMessageTone('danger');
                    setMessage(errs.email);
                } else if (errs.password) {
                    setMessageTone('danger');
                    setMessage(errs.password);
                } else {
                    setMessageTone('danger');
                    setMessage('Invalid credentials. Please try again.');
                }
            },
        });
    };

    return (
        <>
            <Head title="Login" />

            <AuthCard>
                {message && (
                    <AuthAlert
                        tone={messageTone}
                        title="Authentication update"
                        message={message}
                    />
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <AuthInput
                        id="login-email"
                        label="Email address"
                        type="email"
                        value={data.email}
                        placeholder="you@example.com"
                        autocomplete="email"
                        required
                        error={errors.email}
                        onChange={(val) => setData('email', val)}
                    />

                    <AuthPasswordInput
                        id="login-password"
                        label="Password"
                        value={data.password}
                        placeholder="Enter your password"
                        autocomplete="current-password"
                        required
                        error={errors.password}
                        onChange={(val) => setData('password', val)}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link href="/forgot-password" className="btn-link">
                            Forgot your password?
                        </Link>

                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-4 text-sm text-text-muted">
                    New to Royal Grace?{' '}
                    <Link href="/register" className="font-semibold text-brand-700">
                        Create an account
                    </Link>
                </div>
            </AuthCard>
        </>
    );
}

Login.layout = (page) => (
    <GuestLayout
        title="Welcome back"
        subtitle="Sign in to manage bookings, care updates, payments, and communication."
    >
        {page}
    </GuestLayout>
);
