import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/bookings');
            setBookings(response.data.data || []);
        } catch (e) {
            setError('Failed to load bookings. Please refresh and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filtered = useMemo(() => {
        let list = bookings;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(b => 
                (b.booking_number && b.booking_number.toLowerCase().includes(q)) ||
                (b.client && b.client.first_name && b.client.first_name.toLowerCase().includes(q)) ||
                (b.client && b.client.last_name && b.client.last_name.toLowerCase().includes(q)) ||
                (b.service && b.service.name && b.service.name.toLowerCase().includes(q))
            );
        }
        if (statusFilter) {
            list = list.filter(b => b.status === statusFilter);
        }
        return list;
    }, [bookings, search, statusFilter]);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Booking Management" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Bookings</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Manage client bookings, assign caregivers, and monitor service schedules.
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
                            id="booking-search"
                            type="search"
                            placeholder="Search by booking #, client, or service..."
                            className="input-field pl-9 block w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        id="booking-status-filter"
                        className="input-field w-full sm:w-44 block rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="table-wrap">
                    <div className="card-header flex items-center justify-between">
                        <div>
                            <p className="card-title">All Bookings</p>
                            <p className="card-subtitle">{filtered.length} booking{filtered.length !== 1 ? 's' : ''} found</p>
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
                                    <th>Booking #</th>
                                    <th>Client</th>
                                    <th>Service</th>
                                    <th>Scheduled For</th>
                                    <th>Status</th>
                                    <th className="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(booking => (
                                    <tr key={booking.id} className="group hover:bg-surface-subtle cursor-pointer transition-colors" onClick={() => {/* Navigate to details if we had a page */}}>
                                        <td className="font-medium text-brand-600">{booking.booking_number}</td>
                                        <td className="text-text">
                                            {booking.client?.first_name} {booking.client?.last_name}
                                        </td>
                                        <td className="text-text-muted">
                                            {booking.service?.name || booking.service_name_snapshot || 'Unknown Service'}
                                        </td>
                                        <td className="text-text-muted">
                                            {formatDate(booking.scheduled_start_at)}
                                        </td>
                                        <td>
                                            <span className={`status-indicator ${
                                                booking.status === 'confirmed' || booking.status === 'completed' ? 'status-active' :
                                                booking.status === 'cancelled' ? 'status-danger' :
                                                booking.status === 'pending' ? 'status-warning' : 'status-info'
                                            }`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="text-right font-medium text-text">
                                            ${parseFloat(booking.total_amount).toLocaleString()}
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
                                                    {search || statusFilter ? 'No bookings match your filters.' : 'No bookings found.'}
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
