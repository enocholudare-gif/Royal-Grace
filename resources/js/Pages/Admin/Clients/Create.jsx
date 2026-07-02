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
        status: 'active',
    });
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'archived', label: 'Archived' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setMessage('');

        try {
            await axios.post('/clients', form);
            localStorage.setItem('auth_flash_success', 'Client created successfully.');
            router.visit('/admin/clients');
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
            <Head title="Add Client" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href="/admin/clients" className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to Clients
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Add Client</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Create a new client profile and set up their personal and medical information.
                        </p>
                    </div>
                </div>

                {message && (
                    <AuthAlert
                        tone="danger"
                        title="Update Error"
                        message={message}
                    />
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-text mb-4">Personal Details</h2>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <AuthInput
                                id="cl-firstname"
                                value={form.first_name}
                                onChange={val => setForm(f => ({ ...f, first_name: val }))}
                                label="First Name"
                                placeholder="Jane"
                                required
                                error={errors.first_name?.[0]}
                            />
                            <AuthInput
                                id="cl-lastname"
                                value={form.last_name}
                                onChange={val => setForm(f => ({ ...f, last_name: val }))}
                                label="Last Name"
                                placeholder="Doe"
                                required
                                error={errors.last_name?.[0]}
                            />
                            <AuthInput
                                id="cl-email"
                                value={form.email}
                                onChange={val => setForm(f => ({ ...f, email: val }))}
                                label="Email Address"
                                type="email"
                                placeholder="jane@example.com"
                                required
                                error={errors.email?.[0]}
                            />
                            <AuthInput
                                id="cl-phone"
                                value={form.phone}
                                onChange={val => setForm(f => ({ ...f, phone: val }))}
                                label="Phone Number"
                                placeholder="+234..."
                                error={errors.phone?.[0]}
                            />
                            <AuthPasswordInput
                                id="cl-password"
                                value={form.password}
                                onChange={val => setForm(f => ({ ...f, password: val }))}
                                label="Password"
                                placeholder="Temporary password"
                                required
                                error={errors.password?.[0]}
                                help="The client or family will use this to log in."
                            />
                            <AuthInput
                                id="cl-dob"
                                type="date"
                                value={form.date_of_birth}
                                onChange={val => setForm(f => ({ ...f, date_of_birth: val }))}
                                label="Date of Birth"
                                error={errors.date_of_birth?.[0]}
                            />
                            <div className="sm:col-span-2">
                                <AuthSelect
                                    id="cl-status"
                                    value={form.status}
                                    onChange={val => setForm(f => ({ ...f, status: val }))}
                                    label="Status"
                                    options={statusOptions}
                                    required
                                    error={errors.status?.[0]}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-text mb-4">Address Information</h2>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <AuthInput
                                    id="cl-address1"
                                    value={form.address_line_1}
                                    onChange={val => setForm(f => ({ ...f, address_line_1: val }))}
                                    label="Address Line 1"
                                    required
                                    error={errors.address_line_1?.[0]}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <AuthInput
                                    id="cl-address2"
                                    value={form.address_line_2}
                                    onChange={val => setForm(f => ({ ...f, address_line_2: val }))}
                                    label="Address Line 2 (Optional)"
                                    error={errors.address_line_2?.[0]}
                                />
                            </div>
                            <AuthInput
                                id="cl-city"
                                value={form.city}
                                onChange={val => setForm(f => ({ ...f, city: val }))}
                                label="City"
                                required
                                error={errors.city?.[0]}
                            />
                            <AuthInput
                                id="cl-state"
                                value={form.state}
                                onChange={val => setForm(f => ({ ...f, state: val }))}
                                label="State"
                                required
                                error={errors.state?.[0]}
                            />
                            <AuthInput
                                id="cl-postal"
                                value={form.postal_code}
                                onChange={val => setForm(f => ({ ...f, postal_code: val }))}
                                label="Postal Code"
                                required
                                error={errors.postal_code?.[0]}
                            />
                            <AuthInput
                                id="cl-country"
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
                                id="cl-em-name"
                                value={form.emergency_contact_name}
                                onChange={val => setForm(f => ({ ...f, emergency_contact_name: val }))}
                                label="Contact Name"
                                required
                                error={errors.emergency_contact_name?.[0]}
                            />
                            <AuthInput
                                id="cl-em-phone"
                                value={form.emergency_contact_phone}
                                onChange={val => setForm(f => ({ ...f, emergency_contact_phone: val }))}
                                label="Contact Phone"
                                required
                                error={errors.emergency_contact_phone?.[0]}
                            />
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-text mb-4">Medical & Care Notes</h2>
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label" htmlFor="cl-care-notes">Care Preferences</label>
                                <textarea
                                    id="cl-care-notes"
                                    value={form.care_notes}
                                    onChange={e => setForm(f => ({ ...f, care_notes: e.target.value }))}
                                    className={`form-textarea ${errors.care_notes ? 'border-danger-300 focus:border-danger-500' : ''}`}
                                    placeholder="Dietary requirements, routines..."
                                ></textarea>
                                {errors.care_notes?.[0] && <p className="form-error mt-1">{errors.care_notes[0]}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="cl-mobility-notes">Mobility Notes</label>
                                <textarea
                                    id="cl-mobility-notes"
                                    value={form.mobility_notes}
                                    onChange={e => setForm(f => ({ ...f, mobility_notes: e.target.value }))}
                                    className={`form-textarea ${errors.mobility_notes ? 'border-danger-300 focus:border-danger-500' : ''}`}
                                    placeholder="Wheelchair user, requires assistance walking..."
                                ></textarea>
                                {errors.mobility_notes?.[0] && <p className="form-error mt-1">{errors.mobility_notes[0]}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="cl-medical-notes">Medical Notes</label>
                                <textarea
                                    id="cl-medical-notes"
                                    value={form.medical_notes}
                                    onChange={e => setForm(f => ({ ...f, medical_notes: e.target.value }))}
                                    className={`form-textarea ${errors.medical_notes ? 'border-danger-300 focus:border-danger-500' : ''}`}
                                    placeholder="Allergies, current medications, ongoing conditions..."
                                ></textarea>
                                {errors.medical_notes?.[0] && <p className="form-error mt-1">{errors.medical_notes[0]}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link href="/admin/clients" className="btn-ghost">
                            Cancel
                        </Link>
                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Client'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = page => <AdminLayout>{page}</AdminLayout>;
