import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ClientLayout from '../../../Layouts/ClientLayout';

export default function Index({ bookings }) {
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="My Bookings" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text">My Bookings</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Review your upcoming schedules and past caregiver visits.
                    </p>
                </div>

                <div className="card overflow-hidden">
                    {bookings && bookings.length > 0 ? (
                        <table className="table-standard w-full">
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Service</th>
                                    <th>Caregiver</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="font-medium text-text">
                                            {formatDate(booking.scheduled_start_at)}
                                        </td>
                                        <td>{booking.service?.name || '—'}</td>
                                        <td>
                                            {booking.assigned_caregiver?.user ? (
                                                `${booking.assigned_caregiver.user.first_name} ${booking.assigned_caregiver.user.last_name}`
                                            ) : 'Unassigned'}
                                        </td>
                                        <td>
                                            <span className={`status-indicator ${
                                                booking.status === 'completed' ? 'status-active' :
                                                booking.status === 'cancelled' ? 'status-danger' :
                                                booking.status === 'in_progress' ? 'status-warning' : 'status-pending'
                                            }`}>
                                                {booking.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            {booking.status === 'completed' && (
                                                <Link href={`/client/ratings/submit/${booking.id}`} className="btn-secondary btn-sm">
                                                    Rate Visit
                                                </Link>
                                            )}
                                            {booking.status === 'awaiting_payment' && (
                                                <Link href={`/client/bookings/${booking.id}/pay`} className="btn-primary btn-sm">
                                                    Pay Now
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h2 className="text-lg font-bold text-text mb-2">No Bookings Yet</h2>
                            <p className="text-text-muted max-w-md mb-4">
                                You don't have any past or upcoming caregiver visits scheduled right now.
                            </p>
                            <Link href="/client/services" className="btn-primary">
                                Request a Service
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <ClientLayout title="My Bookings" description="Manage and review your upcoming care bookings.">{page}</ClientLayout>;
