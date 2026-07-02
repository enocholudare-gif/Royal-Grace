import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CaregiverLayout from '../../../Layouts/CaregiverLayout';

export default function Index({ bookings, filters }) {
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Visit Reports" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text">Visit Reports</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Manage your active visits and submit completion reports.
                    </p>
                </div>

                <div className="flex border-b border-border mb-6">
                    <Link
                        href="/caregiver/visits?tab=upcoming"
                        className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                            filters.tab === 'upcoming' 
                                ? 'border-brand-500 text-brand-600' 
                                : 'border-transparent text-text-muted hover:text-text hover:border-border'
                        }`}
                    >
                        Active & Upcoming
                    </Link>
                    <Link
                        href="/caregiver/visits?tab=completed"
                        className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                            filters.tab === 'completed' 
                                ? 'border-brand-500 text-brand-600' 
                                : 'border-transparent text-text-muted hover:text-text hover:border-border'
                        }`}
                    >
                        Completed Visits
                    </Link>
                </div>

                <div className="grid gap-4">
                    {bookings.data && bookings.data.length > 0 ? (
                        bookings.data.map(booking => (
                            <div key={booking.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-brand-500">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`status-indicator ${
                                            booking.status === 'in_progress' ? 'status-active' :
                                            booking.status === 'completed' ? 'status-success' : 'status-warning'
                                        }`}>
                                            {booking.status}
                                        </span>
                                        <span className="text-sm font-medium text-text-muted">{booking.service?.name}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text mb-1">
                                        {booking.client?.user?.first_name} {booking.client?.user?.last_name}
                                    </h3>
                                    <p className="text-text-muted">
                                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {formatDate(booking.scheduled_start_at)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/caregiver/visits/${booking.id}`} className="btn-secondary py-2 px-4">
                                        View Details
                                    </Link>
                                    
                                    {booking.status === 'completed' && booking.visitReport && (
                                        <Link href={`/caregiver/visits/reports/${booking.visitReport.id}`} className="btn-primary py-2 px-4">
                                            {booking.visitReport.status === 'submitted' ? 'View Report' : 'Submit Report'}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-surface-subtle text-text-muted rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h2 className="text-lg font-bold text-text mb-2">No visits found</h2>
                            <p className="text-text-muted max-w-md">
                                {filters.tab === 'upcoming' 
                                    ? "You don't have any active or upcoming visits right now." 
                                    : "You haven't completed any visits yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <CaregiverLayout title="Visit Reports" description="Manage your visits">{page}</CaregiverLayout>;
