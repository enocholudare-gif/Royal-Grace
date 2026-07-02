import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Show({ client }) {
    const [activeTab, setActiveTab] = useState('profile');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const tabs = [
        { id: 'profile', label: 'Profile & Notes' },
        { id: 'family', label: `Family (${client.family_members?.length || 0})` },
        { id: 'bookings', label: `Bookings (${client.bookings?.length || 0})` },
        { id: 'attachments', label: `Documents (${client.attachments?.length || 0})` },
    ];

    return (
        <>
            <Head title="Client Profile" />

            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href="/admin/clients" className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to Clients
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-text">
                            {client.user?.first_name} {client.user?.last_name}
                        </h1>
                        <p className="mt-1 text-sm text-text-muted flex items-center gap-2">
                            {client.user?.email}
                            <span className={`status-indicator ${
                                client.status === 'active' ? 'status-active' :
                                client.status === 'archived' ? 'status-danger' : 'status-pending'
                            }`}>
                                {client.status?.charAt(0).toUpperCase() + client.status?.slice(1)}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/clients/${client.id}/edit`} className="btn-primary shrink-0">
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-border">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                                    ${activeTab === tab.id
                                        ? 'border-brand-500 text-brand-600'
                                        : 'border-transparent text-text-muted hover:border-border hover:text-text'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="py-2">
                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-6">
                                <div className="card p-6">
                                    <h2 className="text-lg font-semibold text-text mb-4">Personal Information</h2>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-text-muted">Phone Number</dt>
                                            <dd className="mt-1 text-sm text-text">{client.user?.phone || '—'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-text-muted">Date of Birth</dt>
                                            <dd className="mt-1 text-sm text-text">{formatDate(client.date_of_birth)}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-text-muted">Address</dt>
                                            <dd className="mt-1 text-sm text-text">
                                                {client.address_line_1}<br />
                                                {client.address_line_2 && <>{client.address_line_2}<br /></>}
                                                {client.city}, {client.state} {client.postal_code}<br />
                                                {client.country}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="card p-6 border-l-4 border-l-rose-500">
                                    <h2 className="text-lg font-semibold text-text mb-4">Medical & Care Notes</h2>
                                    <dl className="space-y-6">
                                        <div>
                                            <dt className="text-sm font-medium text-text-muted">Care Preferences</dt>
                                            <dd className="mt-1 text-sm text-text bg-surface p-3 rounded-md border border-border">
                                                {client.care_notes || 'No care preferences specified.'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-text-muted">Mobility Notes</dt>
                                            <dd className="mt-1 text-sm text-text bg-surface p-3 rounded-md border border-border">
                                                {client.mobility_notes || 'No mobility notes specified.'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-text-muted">Medical Notes (Allergies, Meds)</dt>
                                            <dd className="mt-1 text-sm text-text bg-surface p-3 rounded-md border border-border">
                                                {client.medical_notes || 'No medical notes specified.'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="card p-6">
                                    <h2 className="text-lg font-semibold text-text mb-4">Emergency Contact</h2>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-text-muted">Name</dt>
                                            <dd className="mt-1 text-sm font-medium text-text">{client.emergency_contact_name || '—'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-text-muted">Phone</dt>
                                            <dd className="mt-1 text-sm font-medium text-brand-600">
                                                {client.emergency_contact_phone ? (
                                                    <a href={`tel:${client.emergency_contact_phone}`}>{client.emergency_contact_phone}</a>
                                                ) : '—'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FAMILY TAB */}
                    {activeTab === 'family' && (
                        <div className="card">
                            <div className="card-header flex justify-between items-center">
                                <div>
                                    <h3 className="card-title">Family Members</h3>
                                    <p className="card-subtitle">Relatives connected to this client account.</p>
                                </div>
                                <button className="btn-secondary btn-sm">Add Family Member</button>
                            </div>
                            {client.family_members?.length > 0 ? (
                                <table className="table-standard">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Relationship</th>
                                            <th>Contact</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {client.family_members.map(member => (
                                            <tr key={member.id}>
                                                <td className="font-medium text-text">{member.first_name} {member.last_name}</td>
                                                <td>{member.relationship}</td>
                                                <td>{member.phone || member.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-10 text-center text-text-muted">
                                    No family members linked yet.
                                </div>
                            )}
                        </div>
                    )}

                    {/* BOOKINGS TAB */}
                    {activeTab === 'bookings' && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Booking History</h3>
                                <p className="card-subtitle">Past and upcoming bookings.</p>
                            </div>
                            {client.bookings?.length > 0 ? (
                                <table className="table-standard">
                                    <thead>
                                        <tr>
                                            <th>Service</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {client.bookings.map(booking => (
                                            <tr key={booking.id}>
                                                <td className="font-medium text-text">{booking.service?.name}</td>
                                                <td>{formatDate(booking.scheduled_start_at)}</td>
                                                <td>
                                                    <span className={`status-indicator ${
                                                        booking.status === 'completed' ? 'status-active' :
                                                        booking.status === 'cancelled' ? 'status-danger' : 'status-pending'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td>{formatPrice(booking.total_price)}</td>
                                                <td className="text-right">
                                                    <Link href={`/admin/bookings/${booking.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-10 text-center text-text-muted">
                                    No bookings found for this client.
                                </div>
                            )}
                        </div>
                    )}

                    {/* ATTACHMENTS TAB */}
                    {activeTab === 'attachments' && (
                        <div className="card">
                            <div className="card-header flex justify-between items-center">
                                <div>
                                    <h3 className="card-title">Client Documents</h3>
                                    <p className="card-subtitle">Medical records, care plans, and identity docs.</p>
                                </div>
                                <button className="btn-secondary btn-sm">Upload Document</button>
                            </div>
                            {client.attachments?.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {client.attachments.map(doc => (
                                        <div key={doc.id} className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-surface rounded text-text-muted">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-text">{doc.file_name}</p>
                                                    <p className="text-xs text-text-muted">{doc.file_type} • Uploaded {formatDate(doc.created_at)}</p>
                                                </div>
                                            </div>
                                            <a href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                                                Download
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center text-text-muted">
                                    No documents uploaded yet.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Show.layout = page => <AdminLayout>{page}</AdminLayout>;
