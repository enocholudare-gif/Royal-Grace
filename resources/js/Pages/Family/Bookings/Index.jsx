import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import FamilyLayout from '../../../Layouts/FamilyLayout';

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
            const response = await axios.get('/api/family/bookings');
            setBookings(response.data.data || []);
        } catch (e) {
            setError('Failed to load upcoming visits. Please refresh and try again.');
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
                (b.service && b.service.name && b.service.name.toLowerCase().includes(q)) ||
                (b.caregiver && b.caregiver.user && b.caregiver.user.name && b.caregiver.user.name.toLowerCase().includes(q))
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
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Upcoming Visits" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Upcoming Visits</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            View the scheduled care visits for your loved one.
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
                            id="visit-search"
                            type="search"
                            placeholder="Search by service or caregiver..."
                            className="input-field pl-9 block w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        id="visit-status-filter"
                        className="input-field w-full sm:w-44 block rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="assigned">Assigned</option>
                    </select>
                </div>

                <div className="table-wrap">
                    <div className="card-header flex items-center justify-between">
                        <div>
                            <p className="card-title">Visits Schedule</p>
                            <p className="card-subtitle">{filtered.length} visit{filtered.length !== 1 ? 's' : ''} found</p>
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
                                    <th>Service</th>
                                    <th>Caregiver</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(booking => (
                                    <tr key={booking.id} className="group hover:bg-surface-subtle transition-colors">
                                        <td className="font-medium text-brand-600">
                                            {booking.service?.name || booking.service_name_snapshot || 'Unknown Service'}
                                        </td>
                                        <td className="text-text">
                                            {booking.assigned_caregiver?.user?.name || booking.caregiver?.user?.name || 'Pending Assignment'}
                                        </td>
                                        <td className="text-text-muted">
                                            {formatDate(booking.scheduled_start_at)}
                                        </td>
                                        <td className="text-text-muted">
                                            {formatTime(booking.scheduled_start_at)}
                                        </td>
                                        <td>
                                            <span className={`status-indicator ${
                                                booking.status === 'confirmed' || booking.status === 'assigned' ? 'status-active' :
                                                booking.status === 'pending' ? 'status-warning' : 'status-info'
                                            }`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button className="btn-secondary btn-sm" onClick={() => alert('View Details modal to be implemented.')}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="table-empty">
                                            <div className="flex flex-col items-center gap-2 py-10">
                                                <svg className="h-10 w-10 text-text-muted opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-text-muted">
                                                    {search || statusFilter ? 'No visits match your filters.' : 'No upcoming visits found.'}
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
