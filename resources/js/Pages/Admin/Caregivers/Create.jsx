import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AuthAlert from '../../../Components/Auth/AuthAlert';
import AuthInput from '../../../Components/Auth/AuthInput';
import AuthPasswordInput from '../../../Components/Auth/AuthPasswordInput';
import AuthSelect from '../../../Components/Auth/AuthSelect';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Create() {
    const [form, setForm] = useState({
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
        country: 'Nigeria',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        bio: '',
        status: 'active',
    });
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setMessage('');

        try {
            await axios.post('/caregivers', form);
            localStorage.setItem('auth_flash_success', 'Caregiver created successfully.');
            router.visit('/admin/caregivers');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setMessage(error.response?.data?.message || 'An error occurred.');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Add Caregiver" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href="/admin/caregivers" className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to Caregivers
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Add Caregiver</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Create a new caregiver profile and set up their login credentials.
                        </p>
                    </div>
                </div>

                {message && (
                    <AuthAlert
                        tone="danger"
                        title="Update"
                        message={message}
                    />
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-text mb-4">Personal Details</h2>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <AuthInput
                                id="cg-firstname"
                                value={form.first_name}
                                onChange={val => setForm(f => ({ ...f, first_name: val }))}
                                label="First Name"
                                placeholder="Jane"
                                required
                                error={errors.first_name?.[0]}
                            />
                            <AuthInput
                                id="cg-lastname"
                                value={form.last_name}
                                onChange={val => setForm(f => ({ ...f, last_name: val }))}
                                label="Last Name"
                                placeholder="Doe"
                                required
                                error={errors.last_name?.[0]}
                            />
                            <AuthInput
                                id="cg-email"
                                value={form.email}
                                onChange={val => setForm(f => ({ ...f, email: val }))}
                                label="Email Address"
                                type="email"
                                placeholder="jane@example.com"
                                required
                                error={errors.email?.[0]}
                            />
                            <AuthInput
                                id="cg-phone"
                                value={form.phone}
                                onChange={val => setForm(f => ({ ...f, phone: val }))}
                                label="Phone Number"
                                placeholder="+234..."
                                error={errors.phone?.[0]}
                            />
                            <AuthPasswordInput
                                id="cg-password"
                                value={form.password}
                                onChange={val => setForm(f => ({ ...f, password: val }))}
                                label="Password"
                                placeholder="Temporary password"
                                required
                                error={errors.password?.[0]}
                                help="The caregiver will use this to log in."
                            />
                            <AuthSelect
                                id="cg-status"
                                value={form.status}
                                onChange={val => setForm(f => ({ ...f, status: val }))}
                                label="Status"
                                options={statusOptions}
                                required
                                error={errors.status?.[0]}
                            />
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-text mb-4">Address Information</h2>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <AuthInput
                                    id="cg-address1"
                                    value={form.address_line_1}
                                    onChange={val => setForm(f => ({ ...f, address_line_1: val }))}
                                    label="Address Line 1"
                                    required
                                    error={errors.address_line_1?.[0]}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <AuthInput
                                    id="cg-address2"
                                    value={form.address_line_2}
                                    onChange={val => setForm(f => ({ ...f, address_line_2: val }))}
                                    label="Address Line 2 (Optional)"
                                    error={errors.address_line_2?.[0]}
                                />
                            </div>
                            <AuthInput
                                id="cg-city"
                                value={form.city}
                                onChange={val => setForm(f => ({ ...f, city: val }))}
                                label="City"
                                required
                                error={errors.city?.[0]}
                            />
                            <AuthInput
                                id="cg-state"
                                value={form.state}
                                onChange={val => setForm(f => ({ ...f, state: val }))}
                                label="State"
                                required
                                error={errors.state?.[0]}
                            />
                            <AuthInput
                                id="cg-postal"
                                value={form.postal_code}
                                onChange={val => setForm(f => ({ ...f, postal_code: val }))}
                                label="Postal Code"
                                required
                                error={errors.postal_code?.[0]}
                            />
                            <AuthInput
                                id="cg-country"
                                value={form.country}
                                onChange={val => setForm(f => ({ ...f, country: val }))}
                                label="Country"
                                required
                                error={errors.country?.[0]}
                            />
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-text mb-4">Emergency Contact</h2>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <AuthInput
                                id="cg-em-name"
                                value={form.emergency_contact_name}
                                onChange={val => setForm(f => ({ ...f, emergency_contact_name: val }))}
                                label="Contact Name"
                                required
                                error={errors.emergency_contact_name?.[0]}
                            />
                            <AuthInput
                                id="cg-em-phone"
                                value={form.emergency_contact_phone}
                                onChange={val => setForm(f => ({ ...f, emergency_contact_phone: val }))}
                                label="Contact Phone"
                                required
                                error={errors.emergency_contact_phone?.[0]}
                            />
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-text mb-4">Additional Info</h2>
                        <div className="form-group">
                            <label className="form-label" htmlFor="cg-bio">Bio / Notes</label>
                            <textarea
                                id="cg-bio"
                                value={form.bio}
                                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                className={`form-textarea ${errors.bio ? 'border-danger-300 focus:border-danger-500' : ''}`}
                                placeholder="Background info, skills, etc."
                            ></textarea>
                            {errors.bio?.[0] && <p className="form-error mt-1">{errors.bio[0]}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link href="/admin/caregivers" className="btn-ghost">
                            Cancel
                        </Link>
                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Caregiver'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = page => <AdminLayout>{page}</AdminLayout>;
