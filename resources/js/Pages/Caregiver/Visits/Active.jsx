import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import CaregiverLayout from '../../../Layouts/CaregiverLayout';

export default function Active({ booking, visitReport }) {
    const [elapsedTime, setElapsedTime] = useState('');

    useEffect(() => {
        if (!visitReport?.arrival_time) return;
        
        const updateTimer = () => {
            const start = new Date(visitReport.arrival_time).getTime();
            const now = new Date().getTime();
            const diff = now - start;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setElapsedTime(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [visitReport]);

    const formatTime = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Active Visit" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-brand-600 text-white rounded-xl p-8 shadow-lg text-center relative overflow-hidden">
                    {/* Decorative background shapes */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"></div>
                    
                    <h1 className="text-xl font-bold mb-2 text-brand-100">Visit in Progress</h1>
                    <h2 className="text-3xl font-black mb-6">{booking.client?.user?.first_name} {booking.client?.user?.last_name}</h2>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block min-w-[280px]">
                        <p className="text-brand-100 text-sm font-medium uppercase tracking-wider mb-1">Time Elapsed</p>
                        <p className="text-5xl font-mono font-bold tracking-tight">{elapsedTime || '00:00:00'}</p>
                    </div>

                    <div className="mt-8 flex justify-center gap-4 text-sm text-brand-100 font-medium">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                            Clocked in at {formatTime(visitReport.arrival_time)}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-text mb-4 border-b border-border pb-2">Client Details</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-text-muted">Service Required</h4>
                                <p className="font-medium text-text">{booking.service?.name}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-text-muted">Address</h4>
                                <p className="font-medium text-text">{booking.client?.address}</p>
                            </div>
                            {booking.special_instructions && (
                                <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                    <h4 className="text-sm font-bold text-amber-800">Special Instructions</h4>
                                    <p className="text-sm text-amber-900 mt-1">{booking.special_instructions}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card p-6 flex flex-col justify-center text-center">
                        <div className="w-16 h-16 bg-surface-subtle text-text-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-text mb-2">Ready to finish?</h3>
                        <p className="text-text-muted mb-6 text-sm">
                            When you are done with all required tasks, check out to log your departure time.
                        </p>
                        
                        <Link href={`/caregiver/visits/${booking.id}/check-out`} className="btn-primary py-3 px-6 w-full text-center">
                            End Visit (Check Out)
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Active.layout = page => <CaregiverLayout title="Active Visit" description="Visit currently in progress">{page}</CaregiverLayout>;
