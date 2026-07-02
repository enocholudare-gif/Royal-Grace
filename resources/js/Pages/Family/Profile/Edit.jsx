import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import FamilyLayout from '../../../Layouts/FamilyLayout';

export default function Edit() {
    const user = usePage().props.auth.user;

    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const {
        data: pwdData,
        setData: setPwdData,
        patch: pwdPatch,
        processing: pwdProcessing,
        errors: pwdErrors,
        reset: pwdReset,
        recentlySuccessful: pwdRecentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        put('/family/profile', {
            preserveScroll: true,
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        pwdPatch('/family/change-password', {
            preserveScroll: true,
            onSuccess: () => pwdReset(),
        });
    };

    return (
        <>
            <Head title="Profile Settings" />

            <div className="space-y-6 max-w-3xl mx-auto">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Profile Settings</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Manage your account information and preferences.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card">
                        <div className="card-header border-b border-border">
                            <h2 className="text-lg font-semibold text-text">Profile Information</h2>
                            <p className="text-sm text-text-muted">Update your account's profile information and email address.</p>
                        </div>
                        <div className="p-6">
                            <form onSubmit={submitProfile} className="space-y-6 max-w-xl">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-text mb-1">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="input-field block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-brand-500 focus:ring-brand-500"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-danger-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="input-field block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-brand-500 focus:ring-brand-500"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-danger-600">{errors.email}</p>}
                                </div>
                                
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="input-field block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-brand-500 focus:ring-brand-500"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-danger-600">{errors.phone}</p>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button type="submit" disabled={processing} className="btn-primary">
                                        Save Changes
                                    </button>
                                    {recentlySuccessful && <p className="text-sm text-success-600 transition ease-in-out">Saved.</p>}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header border-b border-border">
                            <h2 className="text-lg font-semibold text-text">Update Password</h2>
                            <p className="text-sm text-text-muted">Ensure your account is using a long, random password to stay secure.</p>
                        </div>
                        <div className="p-6">
                            <form onSubmit={submitPassword} className="space-y-6 max-w-xl">
                                <div>
                                    <label htmlFor="current_password" className="block text-sm font-medium text-text mb-1">Current Password</label>
                                    <input
                                        id="current_password"
                                        type="password"
                                        className="input-field block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-brand-500 focus:ring-brand-500"
                                        value={pwdData.current_password}
                                        onChange={(e) => setPwdData('current_password', e.target.value)}
                                        autoComplete="current-password"
                                    />
                                    {pwdErrors.current_password && <p className="mt-1 text-sm text-danger-600">{pwdErrors.current_password}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-text mb-1">New Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="input-field block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-brand-500 focus:ring-brand-500"
                                        value={pwdData.password}
                                        onChange={(e) => setPwdData('password', e.target.value)}
                                        autoComplete="new-password"
                                    />
                                    {pwdErrors.password && <p className="mt-1 text-sm text-danger-600">{pwdErrors.password}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-text mb-1">Confirm Password</label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        className="input-field block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-brand-500 focus:ring-brand-500"
                                        value={pwdData.password_confirmation}
                                        onChange={(e) => setPwdData('password_confirmation', e.target.value)}
                                        autoComplete="new-password"
                                    />
                                    {pwdErrors.password_confirmation && <p className="mt-1 text-sm text-danger-600">{pwdErrors.password_confirmation}</p>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button type="submit" disabled={pwdProcessing} className="btn-primary">
                                        Update Password
                                    </button>
                                    {pwdRecentlySuccessful && <p className="text-sm text-success-600 transition ease-in-out">Saved.</p>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Edit.layout = page => <FamilyLayout>{page}</FamilyLayout>;
