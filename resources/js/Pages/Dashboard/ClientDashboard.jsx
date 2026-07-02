import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ClientLayout from '../../Layouts/ClientLayout';

export default function ClientDashboard({ metrics }) {
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(price);
    };

    return (
        <>
            <Head title="Client Dashboard" />

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Next Booking Card */}
                    <div className="card p-6 border-t-4 border-brand-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-text-muted">Next Care Visit</h3>
                            <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        {metrics.upcomingBooking ? (
                            <>
                                <p className="text-lg font-bold text-text mb-1">
                                    {formatDate(metrics.upcomingBooking.scheduled_start_at)}
                                </p>
                                <p className="text-sm text-text-muted">
                                    {metrics.upcomingBooking.service?.name} with {metrics.upcomingBooking.assigned_caregiver?.user?.first_name || 'Caregiver'}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-text-muted mt-2">No upcoming visits scheduled.</p>
                        )}
                    </div>

                    {/* Active Care Plans Card */}
                    <div className="card p-6 border-t-4 border-rose-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-text-muted">Active Bookings</h3>
                            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </div>
                        <p className="text-3xl font-bold text-text">{metrics.activeBookingsCount}</p>
                    </div>

                    {/* Unpaid Invoices Card */}
                    <div className="card p-6 border-t-4 border-emerald-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-text-muted">Unpaid Balances</h3>
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                        <p className={`text-3xl font-bold ${metrics.unpaidInvoicesSum > 0 ? 'text-rose-600' : 'text-text'}`}>
                            {formatPrice(metrics.unpaidInvoicesSum)}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Invoices */}
                    <div className="card">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-lg font-bold text-text">Recent Invoices</h2>
                            <Link href="/client/invoices" className="text-sm font-medium text-brand-600 hover:text-brand-700">View All</Link>
                        </div>
                        <div className="p-0">
                            {metrics.recentInvoices && metrics.recentInvoices.length > 0 ? (
                                <ul className="divide-y divide-border">
                                    {metrics.recentInvoices.map(invoice => (
                                        <li key={invoice.id} className="p-4 flex justify-between items-center hover:bg-surface-subtle transition-colors">
                                            <div>
                                                <p className="font-medium text-text">{invoice.invoice_number}</p>
                                                <p className="text-xs text-text-muted">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-text">{formatPrice(invoice.total_amount)}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                                                    invoice.status === 'overdue' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {invoice.status}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-8 text-center text-text-muted">No recent invoices found.</div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card p-6">
                        <h2 className="text-lg font-bold text-text mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/client/services" className="p-4 border border-border rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-colors flex flex-col items-center text-center group">
                                <svg className="w-8 h-8 text-brand-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                <span className="font-medium text-text">Request Service</span>
                            </Link>
                            <Link href="/client/bookings" className="p-4 border border-border rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-colors flex flex-col items-center text-center group">
                                <svg className="w-8 h-8 text-brand-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span className="font-medium text-text">View Bookings</span>
                            </Link>
                            <Link href="/client/reports" className="p-4 border border-border rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-colors flex flex-col items-center text-center group">
                                <svg className="w-8 h-8 text-brand-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                <span className="font-medium text-text">Visit Reports</span>
                            </Link>
                            <Link href="/client/invoices" className="p-4 border border-border rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-colors flex flex-col items-center text-center group">
                                <svg className="w-8 h-8 text-brand-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                <span className="font-medium text-text">Pay Invoices</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ClientDashboard.layout = (page) => <ClientLayout>{page}</ClientLayout>;
