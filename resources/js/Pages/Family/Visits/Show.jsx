import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FamilyLayout from '../../../Layouts/FamilyLayout';

export default function Show({ report }) {
    if (!report) {
        return (
            <div className="alert-danger">
                <span className="font-semibold">Error:</span> Visit report not found.
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatDuration = (arrival, departure) => {
        if (!arrival || !departure) return '—';
        const start = new Date(arrival);
        const end = new Date(departure);
        const diffMs = end - start;
        const diffMins = Math.round(diffMs / 60000);
        if (diffMins < 60) return `${diffMins} mins`;
        const hrs = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${hrs}h ${mins}m`;
    };

    return (
        <>
            <Head title={`Visit Report - ${formatDate(report.arrival_time)}`} />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/family/reports" className="text-sm font-medium text-brand-600 hover:text-brand-800 flex items-center gap-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back to Reports
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Visit Report</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Detailed care report for {formatDate(report.arrival_time || report.created_at)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="btn-secondary btn-sm" onClick={() => window.print()}>
                            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Download PDF
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <div className="card">
                            <div className="card-header border-b border-border">
                                <h2 className="text-lg font-semibold text-text">Care Summary</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-text-soft mb-2">Client Condition</h3>
                                    <p className="text-text bg-surface-muted p-4 rounded-lg">{report.client_condition || 'No condition notes provided.'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-text-soft mb-2">Caregiver Notes</h3>
                                    <p className="text-text bg-surface-muted p-4 rounded-lg">{report.caregiver_notes || 'No general notes provided.'}</p>
                                </div>
                                {report.services_performed && (
                                    <div>
                                        <h3 className="text-sm font-medium text-text-soft mb-2">Services Performed</h3>
                                        <ul className="list-disc list-inside space-y-1 text-text ml-1">
                                            {Array.isArray(report.services_performed) ? report.services_performed.map((srv, idx) => (
                                                <li key={idx}>{srv}</li>
                                            )) : <li>{report.services_performed}</li>}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card">
                            <div className="card-header border-b border-border">
                                <h2 className="text-lg font-semibold text-text">Visit Details</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-text-soft uppercase tracking-wide">Caregiver</p>
                                    <p className="mt-1 font-medium text-text">{report.caregiver?.user?.name || 'Unknown Caregiver'}</p>
                                </div>
                                <div className="border-t border-border pt-4">
                                    <p className="text-xs font-semibold text-text-soft uppercase tracking-wide">Status</p>
                                    <div className="mt-1">
                                        <span className={`status-indicator ${report.departure_time ? 'status-active' : 'status-info'}`}>
                                            {report.departure_time ? 'Completed' : 'In Progress'}
                                        </span>
                                    </div>
                                </div>
                                <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-text-soft uppercase tracking-wide">Arrival Time</p>
                                        <p className="mt-1 font-medium text-text">{formatTime(report.arrival_time)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-text-soft uppercase tracking-wide">Departure Time</p>
                                        <p className="mt-1 font-medium text-text">{formatTime(report.departure_time)}</p>
                                    </div>
                                </div>
                                <div className="border-t border-border pt-4">
                                    <p className="text-xs font-semibold text-text-soft uppercase tracking-wide">Total Duration</p>
                                    <p className="mt-1 font-medium text-text">{formatDuration(report.arrival_time, report.departure_time)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = page => <FamilyLayout>{page}</FamilyLayout>;
