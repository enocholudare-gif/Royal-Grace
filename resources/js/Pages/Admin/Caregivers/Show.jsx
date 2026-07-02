import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Show({ caregiver }) {
    return (
        <>
            <Head title="Caregiver Details" />

            <div className="space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href="/admin/caregivers" className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to Caregivers
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-text">{caregiver.first_name} {caregiver.last_name}</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            {caregiver.email}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/caregivers/${caregiver.id}/edit`} className="btn-primary shrink-0">
                            Edit Profile
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-text mb-4">Personal Information</h2>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-text-muted">Phone Number</dt>
                                    <dd className="mt-1 text-sm text-text">{caregiver.phone || '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-text-muted">Status</dt>
                                    <dd className="mt-1">
                                        <span className={`status-indicator ${
                                            caregiver.status === 'active' ? 'status-active' :
                                            caregiver.status === 'suspended' ? 'status-danger' : 'status-pending'
                                        }`}>
                                            {caregiver.status.charAt(0).toUpperCase() + caregiver.status.slice(1)}
                                        </span>
                                    </dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-text-muted">Address</dt>
                                    <dd className="mt-1 text-sm text-text">
                                        {caregiver.address_line_1}<br />
                                        {caregiver.address_line_2 && <>{caregiver.address_line_2}<br /></>}
                                        {caregiver.city}, {caregiver.state} {caregiver.postal_code}<br />
                                        {caregiver.country}
                                    </dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-text-muted">Bio</dt>
                                    <dd className="mt-1 text-sm text-text">{caregiver.bio || '—'}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-text mb-4">Emergency Contact</h2>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-text-muted">Name</dt>
                                    <dd className="mt-1 text-sm text-text">{caregiver.emergency_contact_name || '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-text-muted">Phone</dt>
                                    <dd className="mt-1 text-sm text-text">{caregiver.emergency_contact_phone || '—'}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card p-6">
                            <h3 className="font-semibold text-text mb-4">Quick Actions</h3>
                            <div className="flex flex-col gap-3">
                                <Link href={`/admin/caregivers/${caregiver.id}/availability`} className="btn-secondary w-full justify-start">
                                    Manage Availability
                                </Link>
                                <Link href={`/admin/caregivers/${caregiver.id}/attendance`} className="btn-secondary w-full justify-start">
                                    View Attendance
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = page => <AdminLayout>{page}</AdminLayout>;
