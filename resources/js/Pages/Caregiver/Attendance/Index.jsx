import React from 'react';
import { Head } from '@inertiajs/react';
import CaregiverLayout from '../../../Layouts/CaregiverLayout';

export default function Index({ bookings }) {
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const calculateHours = (start, end) => {
        if (!start || !end) return '0.00';
        const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60);
        return Math.max(0, diff).toFixed(2);
    };

    const totalHours = bookings.reduce((total, booking) => {
        if (booking.visitReport?.arrival_time && booking.visitReport?.departure_time) {
            const diff = (new Date(booking.visitReport.departure_time) - new Date(booking.visitReport.arrival_time)) / (1000 * 60 * 60);
            return total + Math.max(0, diff);
        }
        return total;
    }, 0);

    return (
        <>
            <Head title="Attendance & Timesheets" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Attendance & Timesheets</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Review your completed shifts and total hours logged.
                        </p>
                    </div>
                    <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-brand-600">Total Hours (All Time)</p>
                        <p className="text-2xl font-bold text-brand-700">{totalHours.toFixed(2)} hrs</p>
                    </div>
                </div>

                <div className="card overflow-hidden">
                    {bookings && bookings.length > 0 ? (
                        <table className="table-standard w-full">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Client</th>
                                    <th>Clock In</th>
                                    <th>Clock Out</th>
                                    <th>Logged Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="font-medium text-text">{formatDate(booking.scheduled_start_at)}</td>
                                        <td>{booking.client?.user?.first_name} {booking.client?.user?.last_name}</td>
                                        <td>
                                            {booking.visitReport?.arrival_time ? (
                                                <span className="text-emerald-600 font-medium">{formatTime(booking.visitReport.arrival_time)}</span>
                                            ) : (
                                                <span className="text-text-muted">—</span>
                                            )}
                                        </td>
                                        <td>
                                            {booking.visitReport?.departure_time ? (
                                                <span className="text-emerald-600 font-medium">{formatTime(booking.visitReport.departure_time)}</span>
                                            ) : (
                                                <span className="text-text-muted">—</span>
                                            )}
                                        </td>
                                        <td className="font-bold text-text">
                                            {calculateHours(booking.visitReport?.arrival_time, booking.visitReport?.departure_time)} hrs
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-surface-subtle text-text-muted rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h2 className="text-lg font-bold text-text mb-2">No Attendance Records</h2>
                            <p className="text-text-muted max-w-md">
                                You have not completed any shifts yet. Once you clock out of a visit, your hours will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <CaregiverLayout title="Attendance" description="Review your timesheets">{page}</CaregiverLayout>;
