import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthCard from '../../Components/Auth/AuthCard';
import AuthInput from '../../Components/Auth/AuthInput';
import AuthAlert from '../../Components/Auth/AuthAlert';
import GuestLayout from '../../Layouts/GuestLayout';

export default function ForgotPassword() {
    const { appUrl } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const [message, setMessage] = useState('');
    const [messageTone, setMessageTone] = useState('success');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        post(`${appUrl}/forgot-password`, {
            onSuccess: (page) => {
                setMessage(page.props?.flash?.success || 'Password reset link sent successfully.');
                setMessageTone('success');
            },
            onError: (errs) => {
                setMessageTone('danger');
                if (errs.email) {
                    setMessage(errs.email);
                } else {
                    setMessage('Please provide a valid email address.');
                }
            },
        });
    };

    return (
        <GuestLayout
            title="Forgot your password?"
            subtitle="Enter your email and we'll send you a secure reset link."
        >
            <Head title="Forgot Password" />

            <AuthCard>
                {message && (
                    <AuthAlert
                        tone={messageTone}
                        title="Password recovery"
                        message={message}
                    />
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <AuthInput
                        id="forgot-password-email"
                        label="Email address"
                        type="email"
                        value={data.email}
                        placeholder="you@example.com"
                        autocomplete="email"
                        required
                        error={errors.email}
                        onChange={(val) => setData('email', val)}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link href="/login" className="btn-link">
                            Back to login
                        </Link>

                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Sending link...' : 'Send reset link'}
                        </button>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    );
}
