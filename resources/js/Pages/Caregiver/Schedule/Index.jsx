import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CaregiverLayout from '../../../Layouts/CaregiverLayout';

export default function Index({ bookings }) {
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="My Schedule" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">My Schedule</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Upcoming shifts and client assignments.
                        </p>
                    </div>
                </div>

                <div className="card overflow-hidden">
                    {bookings && bookings.length > 0 ? (
                        <div className="divide-y divide-border">
                            {bookings.map(booking => (
                                <div key={booking.id} className="p-6 hover:bg-surface-subtle transition-colors flex items-center justify-between">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-text">{formatDate(booking.scheduled_start_at)}</h3>
                                            <p className="text-sm font-medium text-text mt-1">{booking.client?.user?.first_name} {booking.client?.user?.last_name}</p>
                                            <p className="text-sm text-text-muted">{booking.service?.name}</p>
                                            
                                            <div className="flex gap-2 mt-2">
                                                <span className={`status-indicator ${
                                                    booking.status === 'in_progress' ? 'status-active' :
                                                    booking.status === 'confirmed' ? 'status-success' : 'status-warning'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Link href={`/caregiver/visits/${booking.id}`} className="btn-primary py-2 px-4 text-sm">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-surface-subtle text-text-muted rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h2 className="text-lg font-bold text-text mb-2">No Upcoming Shifts</h2>
                            <p className="text-text-muted max-w-md">
                                You have no upcoming shifts assigned. Check back later or contact your coordinator.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <CaregiverLayout title="Schedule" description="View your upcoming shifts">{page}</CaregiverLayout>;
