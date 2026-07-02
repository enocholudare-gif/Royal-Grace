import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AuthAlert from '../../../Components/Auth/AuthAlert';
import AuthInput from '../../../Components/Auth/AuthInput';
import AuthSelect from '../../../Components/Auth/AuthSelect';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Edit({ service }) {
    const [form, setForm] = useState({
        name: service.name || '',
        slug: service.slug || '',
        description: service.description || '',
        price: service.price || '',
        duration_minutes: service.duration_minutes || '',
        status: service.status || 'active',
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
            await axios.put(`/services/${service.id}`, payload);
            localStorage.setItem('auth_flash_success', 'Service updated successfully.');
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
            <Head title="Edit Service" />

            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text">Edit Service</h1>
                        <p className="text-sm text-text-muted">Update details for {service.name}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/admin/services/${service.id}`} className="btn-secondary">
                            Cancel
                        </Link>
                    </div>
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
                                required
                                error={errors.name?.[0]}
                            />

                            <AuthInput
                                id="service-slug"
                                value={form.slug}
                                onChange={val => setForm(f => ({ ...f, slug: val }))}
                                label="URL slug (optional)"
                                error={errors.slug?.[0]}
                            />
                        </div>

                        <div>
                            <AuthInput
                                id="service-description"
                                value={form.description}
                                onChange={val => setForm(f => ({ ...f, description: val }))}
                                label="Description"
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
                                required
                                error={errors.price?.[0]}
                            />

                            <AuthInput
                                id="service-duration"
                                value={form.duration_minutes}
                                onChange={val => setForm(f => ({ ...f, duration_minutes: val }))}
                                label="Duration (minutes)"
                                type="number"
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
                                {processing ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Edit.layout = page => <AdminLayout>{page}</AdminLayout>;
