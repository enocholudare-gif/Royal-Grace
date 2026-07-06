import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    const [payments, setPayments] = useState([]);
    const [pendingTransfers, setPendingTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingTransfers, setLoadingTransfers] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [approving, setApproving] = useState(null);
    const [approveSuccess, setApproveSuccess] = useState('');

    const fetchPayments = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/payments');
            setPayments(response.data.data || []);
        } catch (e) {
            setError('Failed to load payments. Please refresh and try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingTransfers = async () => {
        setLoadingTransfers(true);
        try {
            const response = await axios.get('/admin/invoices/pending-transfers');
            setPendingTransfers(response.data || []);
        } catch (e) {
            // Silently fail if endpoint not yet available
        } finally {
            setLoadingTransfers(false);
        }
    };

    useEffect(() => {
        fetchPayments();
        fetchPendingTransfers();
    }, []);

    const handleApproveTransfer = async (invoiceId) => {
        setApproving(invoiceId);
        try {
            await axios.post(`/admin/invoices/${invoiceId}/approve-transfer`);
            setApproveSuccess(`Invoice #${invoiceId} approved successfully!`);
            fetchPendingTransfers();
            setTimeout(() => setApproveSuccess(''), 4000);
        } catch (e) {
            setError('Failed to approve transfer. Please try again.');
        } finally {
            setApproving(null);
        }
    };

    const filtered = useMemo(() => {
        let list = payments;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(p => 
                (p.reference && p.reference.toLowerCase().includes(q)) ||
                (p.booking && p.booking.booking_number && p.booking.booking_number.toLowerCase().includes(q))
            );
        }
        if (statusFilter) {
            list = list.filter(p => p.status === statusFilter);
        }
        return list;
    }, [payments, search, statusFilter]);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-CA', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(price || 0);
    };

    return (
        <>
            <Head title="Payment Management" />

            <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Payments</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Track client payments, bank transfers pending approval, and transaction history.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="alert-danger">
                        <span className="font-semibold">Error:</span> {error}
                    </div>
                )}

                {approveSuccess && (
                    <div className="alert-success">
                        <span className="font-semibold">Success:</span> {approveSuccess}
                    </div>
                )}

                {/* Bank Transfer Pending Verification Section */}
                <div className="card overflow-hidden">
                    <div className="card-header" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-accent-100 text-accent-700">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="card-title">Bank Transfers — Pending Approval</p>
                                <p className="card-subtitle">
                                    {loadingTransfers ? 'Loading...' : `${pendingTransfers.length} transfer${pendingTransfers.length !== 1 ? 's' : ''} awaiting confirmation`}
                                </p>
                            </div>
                            {pendingTransfers.length > 0 && (
                                <span className="ml-auto badge bg-accent-100 text-accent-700 text-sm font-bold px-3 py-1">
                                    {pendingTransfers.length} Pending
                                </span>
                            )}
                        </div>
                    </div>

                    {loadingTransfers ? (
                        <div className="divide-y divide-border">
                            {[1, 2].map(n => (
                                <div key={n} className="flex items-center gap-4 p-4">
                                    <div className="h-4 w-48 animate-pulse rounded bg-surface-subtle" />
                                    <div className="h-4 w-24 animate-pulse rounded bg-surface-subtle" />
                                    <div className="ml-auto h-8 w-24 animate-pulse rounded bg-surface-subtle" />
                                </div>
                            ))}
                        </div>
                    ) : pendingTransfers.length === 0 ? (
                        <div className="p-8 text-center text-text-muted text-sm">
                            ✅ No bank transfers pending approval.
                        </div>
                    ) : (
                        <table className="table-standard w-full">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Client</th>
                                    <th>Amount</th>
                                    <th>Submitted At</th>
                                    <th>Client Note</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingTransfers.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td className="font-medium text-text">{invoice.invoice_number}</td>
                                        <td className="text-text-muted">
                                            {invoice.booking?.client?.user
                                                ? `${invoice.booking.client.user.first_name} ${invoice.booking.client.user.last_name}`
                                                : '—'
                                            }
                                        </td>
                                        <td className="font-semibold text-text">{formatPrice(invoice.total_amount)}</td>
                                        <td className="text-text-muted text-sm">{formatDate(invoice.payment_submitted_at)}</td>
                                        <td className="text-text-muted text-sm max-w-xs truncate">{invoice.bank_transfer_note || '—'}</td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => handleApproveTransfer(invoice.id)}
                                                disabled={approving === invoice.id}
                                                className="btn-success btn-sm"
                                            >
                                                {approving === invoice.id ? 'Approving...' : '✓ Approve Payment'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Regular Payments Table */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                        </svg>
                        <input
                            id="payment-search"
                            type="search"
                            placeholder="Search by reference or booking #..."
                            className="block w-full rounded-lg border border-border bg-white pl-9 px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        id="payment-status-filter"
                        className="block w-full sm:w-44 rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text transition duration-200"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="successful">Successful</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>

                <div className="table-wrap">
                    <div className="card-header flex items-center justify-between">
                        <div>
                            <p className="card-title">All Transactions</p>
                            <p className="card-subtitle">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found</p>
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
                                    <th>Reference</th>
                                    <th>Booking #</th>
                                    <th>Method</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th className="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(payment => (
                                    <tr key={payment.id} className="group hover:bg-surface-subtle transition-colors">
                                        <td className="font-medium text-text">{payment.reference}</td>
                                        <td className="text-brand-600">{payment.booking?.booking_number || '—'}</td>
                                        <td className="text-text-muted capitalize">{payment.payment_method || 'Unknown'}</td>
                                        <td className="text-text-muted">{formatDate(payment.created_at)}</td>
                                        <td>
                                            <span className={`status-indicator ${
                                                payment.status === 'successful' ? 'status-active' :
                                                payment.status === 'failed' || payment.status === 'refunded' ? 'status-danger' :
                                                'status-warning'
                                            }`}>
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="text-right font-medium text-text">
                                            ${parseFloat(payment.amount).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="table-empty">
                                            <div className="flex flex-col items-center gap-2 py-10">
                                                <svg className="h-10 w-10 text-text-muted opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-text-muted">
                                                    {search || statusFilter ? 'No transactions match your filters.' : 'No transactions found.'}
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

Index.layout = page => <AdminLayout>{page}</AdminLayout>;
