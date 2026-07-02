import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CaregiverLayout from '../../../Layouts/CaregiverLayout';

export default function Show({ booking }) {
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title={`Visit Details: ${booking.client?.user?.first_name}`} />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/caregiver/visits" className="text-sm font-medium text-text-muted hover:text-brand-600 transition-colors">
                        &larr; Back to Visits
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 bg-surface rounded-xl p-6 border border-border shadow-sm">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`status-indicator ${
                                booking.status === 'in_progress' ? 'status-active' :
                                booking.status === 'completed' ? 'status-success' : 'status-warning'
                            }`}>
                                {booking.status.replace('_', ' ')}
                            </span>
                            <span className="text-sm font-medium text-text-muted">{booking.reference_id || 'Booking'}</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">
                            Visit with {booking.client?.user?.first_name} {booking.client?.user?.last_name}
                        </h1>
                        <p className="mt-1 text-sm text-text-muted flex items-center">
                            <svg className="w-4 h-4 mr-1 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {formatDate(booking.scheduled_start_at)}
                        </p>
                    </div>

                    <div className="flex gap-3 mt-4 md:mt-0">
                        {['scheduled', 'confirmed'].includes(booking.status) && (
                            <Link href={`/caregiver/visits/${booking.id}/check-in`} className="btn-primary py-2 px-6 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                                Start Visit (Check In)
                            </Link>
                        )}
                        {booking.status === 'in_progress' && (
                            <Link href={`/caregiver/visits/${booking.id}/active`} className="btn-primary py-2 px-6 bg-amber-500 hover:bg-amber-600 border-amber-600 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Active Visit Dashboard
                            </Link>
                        )}
                        {booking.status === 'completed' && booking.visitReport && booking.visitReport.status !== 'submitted' && (
                            <Link href={`/caregiver/visits/reports/${booking.visitReport.id}`} className="btn-primary py-2 px-6">
                                Submit Final Report
                            </Link>
                        )}
                        {booking.status === 'completed' && booking.visitReport && booking.visitReport.status === 'submitted' && (
                            <Link href={`/caregiver/visits/reports/${booking.visitReport.id}`} className="btn-secondary py-2 px-6">
                                View Submitted Report
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <div className="card p-6">
                            <h2 className="text-lg font-bold text-text mb-4 border-b border-border pb-2">Service Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-text-muted">Requested Service</h3>
                                    <p className="text-text font-medium mt-1">{booking.service?.name}</p>
                                    <p className="text-sm text-text-muted mt-1">{booking.service?.description}</p>
                                </div>
                                {booking.special_instructions && (
                                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                        <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                            Special Instructions
                                        </h3>
                                        <p className="text-amber-900 mt-2 text-sm">{booking.special_instructions}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card p-6">
                            <h2 className="text-lg font-bold text-text mb-4 border-b border-border pb-2">Client Information</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-text-muted">Full Name</h3>
                                    <p className="text-text font-medium mt-1">{booking.client?.user?.first_name} {booking.client?.user?.last_name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-text-muted">Phone Number</h3>
                                    <p className="text-text font-medium mt-1">{booking.client?.user?.phone || 'Not provided'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-text-muted">Address</h3>
                                    <p className="text-text font-medium mt-1">
                                        {booking.client?.address}
                                        {booking.client?.city && `, ${booking.client.city}`}
                                    </p>
                                </div>
                                {booking.client?.medical_conditions && (
                                    <div className="md:col-span-2 mt-2">
                                        <h3 className="text-sm font-medium text-text-muted mb-2">Known Medical Conditions</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(booking.client.medical_conditions) 
                                                ? booking.client.medical_conditions.map((condition, i) => (
                                                    <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-100">
                                                        {condition}
                                                    </span>
                                                  ))
                                                : <span className="text-sm text-text">{booking.client.medical_conditions}</span>
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card p-6">
                            <h2 className="text-lg font-bold text-text mb-4 border-b border-border pb-2">Visit Timeline</h2>
                            <div className="relative border-l-2 border-brand-200 ml-3 space-y-6">
                                <div className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface ${
                                        ['confirmed', 'in_progress', 'completed'].includes(booking.status) ? 'bg-brand-500' : 'bg-border'
                                    }`}></div>
                                    <h3 className="text-sm font-bold text-text">Scheduled</h3>
                                    <p className="text-xs text-text-muted mt-1">{formatDate(booking.scheduled_start_at)}</p>
                                </div>
                                
                                <div className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface ${
                                        ['in_progress', 'completed'].includes(booking.status) ? 'bg-brand-500' : 'bg-border'
                                    }`}></div>
                                    <h3 className="text-sm font-bold text-text">Check-in</h3>
                                    <p className="text-xs text-text-muted mt-1">
                                        {booking.visitReport?.arrival_time ? formatDate(booking.visitReport.arrival_time) : 'Waiting for check-in'}
                                    </p>
                                </div>
                                
                                <div className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface ${
                                        booking.status === 'completed' ? 'bg-brand-500' : 'bg-border'
                                    }`}></div>
                                    <h3 className="text-sm font-bold text-text">Check-out</h3>
                                    <p className="text-xs text-text-muted mt-1">
                                        {booking.visitReport?.departure_time ? formatDate(booking.visitReport.departure_time) : 'Pending'}
                                    </p>
                                </div>

                                <div className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface ${
                                        booking.visitReport?.status === 'submitted' ? 'bg-emerald-500' : 'bg-border'
                                    }`}></div>
                                    <h3 className="text-sm font-bold text-text">Report Submitted</h3>
                                    <p className="text-xs text-text-muted mt-1">
                                        {booking.visitReport?.submitted_at ? formatDate(booking.visitReport.submitted_at) : 'Pending'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = page => <CaregiverLayout title="Visit Details" description="Prepare for your upcoming visit">{page}</CaregiverLayout>;
