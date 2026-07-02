import React from 'react';
import { Head } from '@inertiajs/react';
import ClientLayout from '../../../Layouts/ClientLayout';

export default function Index({ invoices }) {
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(price);
    };

    return (
        <>
            <Head title="Invoices" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text">Invoices & Billing</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Review your billing history and download past invoices.
                    </p>
                </div>

                <div className="card overflow-hidden">
                    {invoices && invoices.length > 0 ? (
                        <table className="table-standard w-full">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Date Issued</th>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td className="font-medium text-text">{invoice.invoice_number}</td>
                                        <td>{formatDate(invoice.created_at)}</td>
                                        <td>{formatDate(invoice.due_date)}</td>
                                        <td className="font-medium text-text">{formatPrice(invoice.total_amount)}</td>
                                        <td>
                                            <span className={`status-indicator ${
                                                invoice.status === 'paid' ? 'status-active' :
                                                invoice.status === 'overdue' ? 'status-danger' : 'status-warning'
                                            }`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <a href={`/storage/${invoice.pdf_path}`} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
                                                Download PDF
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                            </div>
                            <h2 className="text-lg font-bold text-text mb-2">No Invoices Yet</h2>
                            <p className="text-text-muted max-w-md">
                                You currently have no pending or past invoices. All your billing history will be securely stored here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <ClientLayout title="Invoices" description="Manage your billing, payments, and view past invoices.">{page}</ClientLayout>;
