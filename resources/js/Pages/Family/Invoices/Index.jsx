import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import FamilyLayout from '../../../Layouts/FamilyLayout';

export default function Index() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchInvoices = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/api/family/invoices');
            setInvoices(response.data.data || []);
        } catch (e) {
            setError('Failed to load invoices. Please refresh and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const filtered = useMemo(() => {
        let list = invoices;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(inv => 
                (inv.invoice_number && inv.invoice_number.toLowerCase().includes(q)) ||
                (inv.booking?.service?.name && inv.booking.service.name.toLowerCase().includes(q))
            );
        }
        if (statusFilter) {
            list = list.filter(inv => inv.status === statusFilter);
        }
        return list;
    }, [invoices, search, statusFilter]);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);
    };

    return (
        <>
            <Head title="Invoices & Billing" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Invoices & Billing</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Manage payments and review outstanding balances for care services.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="alert-danger">
                        <span className="font-semibold">Error:</span> {error}
                    </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                        </svg>
                        <input
                            id="invoice-search"
                            type="search"
                            placeholder="Search by invoice number or service..."
                            className="input-field pl-9 block w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        id="invoice-status-filter"
                        className="input-field w-full sm:w-44 block rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="table-wrap">
                    <div className="card-header flex items-center justify-between">
                        <div>
                            <p className="card-title">Billing History</p>
                            <p className="card-subtitle">{filtered.length} invoice{filtered.length !== 1 ? 's' : ''} found</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="divide-y divide-border">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="flex items-center gap-4 p-4">
                                    <div className="h-4 w-48 animate-pulse rounded bg-surface-subtle" />
                                    <div className="h-4 w-24 animate-pulse rounded bg-surface-subtle" />
                                    <div className="h-4 w-16 animate-pulse rounded bg-surface-subtle" />
                                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-surface-subtle" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table className="table-standard">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Service</th>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(invoice => (
                                    <tr key={invoice.id} className="group hover:bg-surface-subtle transition-colors">
                                        <td className="font-medium text-brand-600">
                                            {invoice.invoice_number || `INV-${invoice.id}`}
                                        </td>
                                        <td className="text-text">
                                            {invoice.booking?.service?.name || 'Care Service'}
                                        </td>
                                        <td className="text-text-muted">
                                            {formatDate(invoice.due_date)}
                                        </td>
                                        <td className="font-medium text-text">
                                            {formatCurrency(invoice.amount)}
                                        </td>
                                        <td>
                                            <span className={`status-indicator ${
                                                invoice.status === 'paid' ? 'status-active' :
                                                invoice.status === 'overdue' ? 'status-danger' :
                                                invoice.status === 'cancelled' ? 'status-secondary' : 'status-warning'
                                            }`}>
                                                {invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="text-right space-x-2">
                                            <button className="btn-secondary btn-sm" onClick={() => alert('View Invoice modal to be implemented.')}>
                                                View
                                            </button>
                                            <button className="text-brand-600 hover:text-brand-800 p-1" title="Download PDF" onClick={() => window.print()}>
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="table-empty">
                                            <div className="flex flex-col items-center gap-2 py-10">
                                                <svg className="h-10 w-10 text-text-muted opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-text-muted">
                                                    {search || statusFilter ? 'No invoices match your filters.' : 'No invoices found.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <FamilyLayout>{page}</FamilyLayout>;
