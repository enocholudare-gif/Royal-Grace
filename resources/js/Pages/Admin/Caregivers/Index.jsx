import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    const [caregivers, setCaregivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [flashMessage, setFlashMessage] = useState('');

    const fetchCaregivers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/caregivers');
            setCaregivers(response.data.data || []);
        } catch (e) {
            setError('Failed to load caregivers. Please refresh and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem('auth_flash_success');
        if (stored) {
            setFlashMessage(stored);
            localStorage.removeItem('auth_flash_success');
            setTimeout(() => setFlashMessage(''), 5000);
        }
        fetchCaregivers();
    }, []);

    const filtered = useMemo(() => {
        let list = caregivers;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(c => 
                c.first_name.toLowerCase().includes(q) || 
                c.last_name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q)
            );
        }
        if (statusFilter) {
            list = list.filter(c => c.status === statusFilter);
        }
        return list;
    }, [caregivers, search, statusFilter]);

    return (
        <>
            <Head title="Caregiver Management" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Caregivers</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Manage your caregiver team, assignments, and availability.
                        </p>
                    </div>
                    <Link href="/admin/caregivers/create" className="btn-primary shrink-0">
                        + Add caregiver
                    </Link>
                </div>

                {flashMessage && (
                    <div className="alert-success flex items-center justify-between">
                        <span>{flashMessage}</span>
                        <button className="text-sm opacity-60 hover:opacity-100" onClick={() => setFlashMessage('')}>✕</button>
                    </div>
                )}

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
                            id="caregiver-search"
                            type="search"
                            placeholder="Search caregivers by name or email..."
                            className="input-field pl-9 block w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        id="caregiver-status-filter"
                        className="input-field w-full sm:w-44 block rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                <div className="table-wrap">
                    <div className="card-header flex items-center justify-between">
                        <div>
                            <p className="card-title">All Caregivers</p>
                            <p className="card-subtitle">{filtered.length} caregiver{filtered.length !== 1 ? 's' : ''} found</p>
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
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(caregiver => (
                                    <tr key={caregiver.id} className="group">
                                        <td className="font-medium text-text">{caregiver.first_name} {caregiver.last_name}</td>
                                        <td className="text-text-muted">{caregiver.email}</td>
                                        <td className="text-text-muted">{caregiver.phone || '—'}</td>
                                        <td>
                                            <span className={`status-indicator ${
                                                caregiver.status === 'active' ? 'status-active' :
                                                caregiver.status === 'suspended' ? 'status-danger' : 'status-pending'
                                            }`}>
                                                {caregiver.status.charAt(0).toUpperCase() + caregiver.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link href={`/admin/caregivers/${caregiver.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                                                    View
                                                </Link>
                                                <Link href={`/admin/caregivers/${caregiver.id}/edit`} className="text-sm font-medium text-text-muted hover:text-text">
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="table-empty">
                                            <div className="flex flex-col items-center gap-2 py-10">
                                                <svg className="h-10 w-10 text-text-muted opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-text-muted">
                                                    {search || statusFilter ? 'No caregivers match your filters.' : 'No caregivers yet. Add your first caregiver.'}
                                                </p>
                                                {!search && !statusFilter && (
                                                    <Link href="/admin/caregivers/create" className="btn-primary btn-sm mt-1">
                                                        Add caregiver
                                                    </Link>
                                                )}
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
