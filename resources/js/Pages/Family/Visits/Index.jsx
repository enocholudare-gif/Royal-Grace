import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import FamilyLayout from '../../../Layouts/FamilyLayout';

export default function Index() {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const fetchVisits = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/api/family/visits');
            setVisits(response.data.data || []);
        } catch (e) {
            setError('Failed to load visit reports. Please refresh and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const filtered = useMemo(() => {
        let list = visits;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(v => 
                (v.caregiver && v.caregiver.user && v.caregiver.user.name && v.caregiver.user.name.toLowerCase().includes(q)) ||
                (v.client_condition && v.client_condition.toLowerCase().includes(q))
            );
        }
        return list;
    }, [visits, search]);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
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
            <Head title="Visit Reports" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Completed Visits</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Review detailed care reports submitted by caregivers.
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
                            placeholder="Search by caregiver or condition..."
                            className="input-field pl-9 block w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-wrap">
                    <div className="card-header flex items-center justify-between">
                        <div>
                            <p className="card-title">Recent Reports</p>
                            <p className="card-subtitle">{filtered.length} report{filtered.length !== 1 ? 's' : ''} found</p>
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
                                    <th>Date</th>
                                    <th>Caregiver</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(visit => (
                                    <tr key={visit.id} className="group hover:bg-surface-subtle transition-colors">
                                        <td className="font-medium text-brand-600">
                                            {formatDate(visit.arrival_time || visit.created_at)}
                                        </td>
                                        <td className="text-text">
                                            {visit.caregiver?.user?.name || 'Unknown Caregiver'}
                                        </td>
                                        <td className="text-text-muted">
                                            {formatDuration(visit.arrival_time, visit.departure_time)}
                                        </td>
                                        <td>
                                            <span className={`status-indicator ${
                                                visit.departure_time ? 'status-active' : 'status-info'
                                            }`}>
                                                {visit.departure_time ? 'Completed' : 'In Progress'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            {visit.departure_time ? (
                                                <Link href={`/family/reports/${visit.id}`} className="btn-secondary btn-sm">
                                                    View Report
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-text-soft">Pending report</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="table-empty">
                                            <div className="flex flex-col items-center gap-2 py-10">
                                                <svg className="h-10 w-10 text-text-muted opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-text-muted">
                                                    {search ? 'No reports match your search.' : 'No completed visit reports yet.'}
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
