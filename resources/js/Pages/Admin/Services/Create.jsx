import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AuthAlert from '../../../Components/Auth/AuthAlert';
import AuthInput from '../../../Components/Auth/AuthInput';
import AuthSelect from '../../../Components/Auth/AuthSelect';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Create() {
    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        duration_minutes: '',
        status: 'active',
    });
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setMessage('');

        const payload = { ...form };
        if (!payload.slug) delete payload.slug;

        try {
            await axios.post('/services', payload);
            localStorage.setItem('auth_flash_success', 'Service created successfully.');
            router.visit('/admin/services');
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
            <Head title="Create Service" />

            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text">Create Service</h1>
                        <p className="text-sm text-text-muted">Define a new care service offering.</p>
                    </div>
                    <Link href="/admin/services" className="btn-secondary">
                        Back to list
                    </Link>
                </div>

                <div className="card p-6">
                    {message && (
                        <AuthAlert
                            tone="danger"
                            title="Status update"
                            message={message}
                        />
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid gap-5 md:grid-cols-2">
                            <AuthInput
                                id="service-name"
                                value={form.name}
                                onChange={val => setForm(f => ({ ...f, name: val }))}
                                label="Service name"
                                placeholder="e.g., Standard Home Care"
                                required
                                error={errors.name?.[0]}
                            />

                            <AuthInput
                                id="service-slug"
                                value={form.slug}
                                onChange={val => setForm(f => ({ ...f, slug: val }))}
                                label="URL slug (optional)"
                                placeholder="e.g., standard-home-care"
                                error={errors.slug?.[0]}
                            />
                        </div>

                        <div>
                            <AuthInput
                                id="service-description"
                                value={form.description}
                                onChange={val => setForm(f => ({ ...f, description: val }))}
                                label="Description"
                                placeholder="Briefly describe what this service includes..."
                                error={errors.description?.[0]}
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <AuthInput
                                id="service-price"
                                value={form.price}
                                onChange={val => setForm(f => ({ ...f, price: val }))}
                                label="Price ($)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                required
                                error={errors.price?.[0]}
                            />

                            <AuthInput
                                id="service-duration"
                                value={form.duration_minutes}
                                onChange={val => setForm(f => ({ ...f, duration_minutes: val }))}
                                label="Duration (minutes)"
                                type="number"
                                placeholder="60"
                                required
                                error={errors.duration_minutes?.[0]}
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <AuthSelect
                                id="service-status"
                                value={form.status}
                                onChange={val => setForm(f => ({ ...f, status: val }))}
                                label="Status"
                                options={statusOptions}
                                required
                                error={errors.status?.[0]}
                            />
                        </div>

                        <div className="flex items-center justify-end border-t border-border pt-5">
                            <button type="submit" className="btn-primary" disabled={processing}>
                                {processing ? 'Creating...' : 'Create service'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Create.layout = page => <AdminLayout>{page}</AdminLayout>;
