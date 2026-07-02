import React from 'react';
import { Head } from '@inertiajs/react';
import ClientLayout from '../../../Layouts/ClientLayout';

export default function Index({ reports }) {
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
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
                        Review detailed logs and summaries submitted by caregivers after each visit.
                    </p>
                </div>

                <div className="space-y-4">
                    {reports && reports.length > 0 ? reports.map(report => (
                        <div key={report.id} className="card p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-text">
                                        {report.booking?.service?.name || 'Care Visit'}
                                    </h3>
                                    <p className="text-sm text-text-muted mt-1">
                                        Caregiver: {report.caregiver?.user?.first_name} {report.caregiver?.user?.last_name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-medium text-text bg-surface px-3 py-1 rounded-full border border-border">
                                        {formatDate(report.created_at)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="bg-surface-subtle p-4 rounded-md border border-border mt-4">
                                <h4 className="text-sm font-medium text-text mb-2">Caregiver Notes</h4>
                                <p className="text-sm text-text whitespace-pre-wrap">{report.notes}</p>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium text-text-muted">Caregiver Rating:</span>
                                    <span className="text-amber-500 font-bold ml-1">{report.rating}/5</span>
                                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                </div>
                                {report.status === 'flagged' && (
                                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded">Flagged for Review</span>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="card p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h2 className="text-lg font-bold text-text mb-2">No Reports Yet</h2>
                            <p className="text-text-muted max-w-md">
                                Caregivers haven't submitted any visit reports for you yet. They will appear here once your care visits are completed.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <ClientLayout title="Visit Reports" description="Review detailed logs and summaries from caregiver visits.">{page}</ClientLayout>;
