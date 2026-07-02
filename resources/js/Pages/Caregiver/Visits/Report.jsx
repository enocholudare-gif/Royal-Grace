import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CaregiverLayout from '../../../Layouts/CaregiverLayout';

export default function Report({ visitReport, flash }) {
    const isSubmitted = visitReport.status !== 'draft';
    
    const { data, setData, post, processing, errors } = useForm({
        services_performed: visitReport.services_performed || '',
        observations: visitReport.observations || '',
        client_condition: visitReport.client_condition || '',
        notes: visitReport.notes || ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/caregiver/visits/reports/${visitReport.id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Visit Report" />
            
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link href="/caregiver/visits" className="text-sm font-medium text-text-muted hover:text-brand-600 transition-colors">
                        &larr; Back to Visits
                    </Link>
                    
                    {isSubmitted && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 uppercase tracking-wider">
                            Report Submitted
                        </span>
                    )}
                </div>

                {flash && (
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {flash}
                    </div>
                )}

                <div className="card overflow-hidden">
                    <div className="bg-surface-subtle p-6 border-b border-border flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-text">Visit Report</h1>
                            <p className="mt-1 text-sm text-text-muted">
                                {visitReport.booking?.client?.user?.first_name} {visitReport.booking?.client?.user?.last_name} • {visitReport.booking?.service?.name}
                            </p>
                        </div>
                        <div className="text-right text-sm">
                            <p className="text-text-muted">Clock In: <span className="font-bold text-text">{formatDate(visitReport.arrival_time)}</span></p>
                            <p className="text-text-muted">Clock Out: <span className="font-bold text-text">{formatDate(visitReport.departure_time)}</span></p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">
                                Services Performed <span className="text-rose-500">*</span>
                            </label>
                            <p className="text-xs text-text-muted mb-2">Detail exactly what tasks were completed during this visit.</p>
                            <textarea
                                value={data.services_performed}
                                onChange={e => setData('services_performed', e.target.value)}
                                className={`input-standard w-full min-h-[120px] resize-y ${errors.services_performed ? 'border-rose-500 ring-rose-500' : ''}`}
                                placeholder="E.g., Assisted with bathing, prepared lunch, administered medication..."
                                disabled={isSubmitted}
                                required
                            />
                            {errors.services_performed && <p className="mt-1 text-sm text-rose-500">{errors.services_performed}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text mb-2">
                                Client Condition <span className="text-rose-500">*</span>
                            </label>
                            <p className="text-xs text-text-muted mb-2">How was the client physically and emotionally today?</p>
                            <textarea
                                value={data.client_condition}
                                onChange={e => setData('client_condition', e.target.value)}
                                className={`input-standard w-full min-h-[100px] resize-y ${errors.client_condition ? 'border-rose-500 ring-rose-500' : ''}`}
                                placeholder="E.g., Client was in good spirits, experienced some minor back pain..."
                                disabled={isSubmitted}
                                required
                            />
                            {errors.client_condition && <p className="mt-1 text-sm text-rose-500">{errors.client_condition}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Observations (Optional)</label>
                            <p className="text-xs text-text-muted mb-2">Any changes in home environment, behavior, or unusual events.</p>
                            <textarea
                                value={data.observations}
                                onChange={e => setData('observations', e.target.value)}
                                className={`input-standard w-full min-h-[100px] resize-y ${errors.observations ? 'border-rose-500 ring-rose-500' : ''}`}
                                disabled={isSubmitted}
                            />
                            {errors.observations && <p className="mt-1 text-sm text-rose-500">{errors.observations}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Additional Notes (Optional)</label>
                            <textarea
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                className={`input-standard w-full min-h-[80px] resize-y ${errors.notes ? 'border-rose-500 ring-rose-500' : ''}`}
                                disabled={isSubmitted}
                            />
                            {errors.notes && <p className="mt-1 text-sm text-rose-500">{errors.notes}</p>}
                        </div>

                        {!isSubmitted && (
                            <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-primary py-3 px-8 text-lg w-full md:w-auto"
                                >
                                    {processing ? 'Submitting Report...' : 'Submit Visit Report'}
                                </button>
                            </div>
                        )}
                        
                        {isSubmitted && (
                            <div className="pt-4 border-t border-border text-center">
                                <p className="text-sm font-medium text-text-muted">
                                    This report was submitted and can no longer be edited.
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}

Report.layout = page => <CaregiverLayout title="Visit Report" description="Log your visit details">{page}</CaregiverLayout>;
