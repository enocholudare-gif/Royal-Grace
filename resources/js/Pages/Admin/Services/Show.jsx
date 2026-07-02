import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Show({ service }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(price);
    };

    return (
        <>
            <Head title={`Service: ${service.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text">{service.name}</h1>
                        <p className="text-sm text-text-muted">Service details and configuration.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin/services" className="btn-secondary">
                            Back
                        </Link>
                        <Link href={`/admin/services/${service.id}/edit`} className="btn-primary">
                            Edit Service
                        </Link>
                    </div>
                </div>

                <div className="card p-6 space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted">Description</h3>
                            <p className="mt-1 text-text">{service.description || 'No description provided.'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted">Slug</h3>
                            <p className="mt-1 text-text">{service.slug}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted">Price</h3>
                            <p className="mt-1 text-text font-medium">{formatPrice(service.price)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted">Duration</h3>
                            <p className="mt-1 text-text">{service.duration_minutes} minutes</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-muted">Status</h3>
                            <p className="mt-1">
                                <span className={`status-indicator ${service.status === 'active' ? 'status-active' : 'status-pending'}`}>
                                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = page => <AdminLayout>{page}</AdminLayout>;
