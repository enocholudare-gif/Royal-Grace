import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [flashMessage, setFlashMessage] = useState('');

    const fetchClients = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/clients');
            setClients(response.data.data || []);
        } catch (e) {
            setError('Failed to load clients. Please refresh and try again.');
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
        fetchClients();
    }, []);

    const filtered = useMemo(() => {
        let list = clients;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(c => 
                c.first_name?.toLowerCase().includes(q) || 
                c.last_name?.toLowerCase().includes(q) ||
                c.email?.toLowerCase().includes(q)
            );
        }
        if (statusFilter) {
            list = list.filter(c => c.status === statusFilter);
        }
        return list;
    }, [clients, search, statusFilter]);

    const deleteClient = async (client) => {
        if (!window.confirm(`Delete "${client.first_name} ${client.last_name}"? This action can be reversed via restore.`)) return;

        setDeletingId(client.id);
        try {
            await axios.delete(`/clients/${client.id}`);
            setClients(prev => prev.filter(c => c.id !== client.id));
            setFlashMessage(`"${client.first_name} ${client.last_name}" deleted successfully.`);
            setTimeout(() => setFlashMessage(''), 4000);
        } catch (e) {
            alert('Failed to delete the client. They may have active dependencies.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Head title="Client Management" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Clients</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Manage your client database, profiles, and associated care plans.
                        </p>
                    </div>
                    <Link href="/admin/clients/create" className="btn-primary shrink-0">
                        + Add client
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
                            id="client-search"
                            type="search"
                            placeholder="Search clients by name or email..."
                            className="input-field pl-9 block w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        id="client-status-filter"
                        className="input-field w-full sm:w-44 block rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-soft transition duration-200"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div className="table-wrap">
                    <div className="card-header flex items-center justify-between">
                        <div>
                            <p className="card-title">All Clients</p>
                            <p className="card-subtitle">{filtered.length} client{filtered.length !== 1 ? 's' : ''} found</p>
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
                                {filtered.map(client => (
                                    <tr key={client.id} className="group">
                                        <td className="font-medium text-text">{client.first_name} {client.last_name}</td>
                                        <td className="text-text-muted">{client.email}</td>
                                        <td className="text-text-muted">{client.phone || '—'}</td>
                                        <td>
                                            <span className={`status-indicator ${
                                                client.status === 'active' ? 'status-active' :
                                                client.status === 'archived' ? 'status-danger' : 'status-pending'
                                            }`}>
                                                {client.status?.charAt(0).toUpperCase() + client.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link href={`/admin/clients/${client.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                                                    View
                                                </Link>
                                                <Link href={`/admin/clients/${client.id}/edit`} className="text-sm font-medium text-text-muted hover:text-text">
                                                    Edit
                                                </Link>
                                                <button
                                                    className="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-40"
                                                    disabled={deletingId === client.id}
                                                    onClick={() => deleteClient(client)}
                                                >
                                                    {deletingId === client.id ? 'Deleting…' : 'Delete'}
                                                </button>
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
                                                    {search || statusFilter ? 'No clients match your filters.' : 'No clients yet. Add your first client.'}
                                                </p>
                                                {!search && !statusFilter && (
                                                    <Link href="/admin/clients/create" className="btn-primary btn-sm mt-1">
                                                        Add client
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
