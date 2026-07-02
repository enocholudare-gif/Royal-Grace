import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [flashMessage, setFlashMessage] = useState('');

    const fetchServices = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/services');
            setServices(response.data.data || []);
        } catch (e) {
            setError('Failed to load services. Please refresh and try again.');
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
        fetchServices();
    }, []);

    const filtered = useMemo(() => {
        let list = services;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(s => 
                s.name.toLowerCase().includes(q) || 
                (s.description || '').toLowerCase().includes(q)
            );
        }
        if (statusFilter) {
            list = list.filter(s => s.status === statusFilter);
        }
        return list;
    }, [services, search, statusFilter]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(price);
    };

    const deleteService = async (service) => {
        if (!window.confirm(`Delete "${service.name}"? This action cannot be undone.`)) return;

        setDeletingId(service.id);
        try {
            await axios.delete(`/services/${service.id}`);
            setServices(prev => prev.filter(s => s.id !== service.id));
            setFlashMessage(`"${service.name}" deleted successfully.`);
            setTimeout(() => setFlashMessage(''), 4000);
        } catch (e) {
            alert('Failed to delete the service. It may have active bookings.');
        } finally {
            setDeletingId(null);
        }
    };

    const disableService = async (service) => {
        try {
            const response = await axios.patch(`/services/${service.id}/disable`);
            const updated = response.data.data ?? response.data;
            setServices(prev => prev.map(s => s.id === service.id ? { ...s, ...updated } : s));
            setFlashMessage(`"${service.name}" has been disabled.`);
            setTimeout(() => setFlashMessage(''), 4000);
        } catch (e) {
            alert('Failed to disable the service.');
        }
    };

    return (
        <>
            <Head title="Service Management" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Services</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Manage the care services available for client bookings.
                        </p>
                    </div>
                    <Link href="/admin/services/create" className="btn-primary shrink-0">
                        + New service
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
                            id="service-search"
                            type="search"
                            placeholder="Search services by name or description..."
                            className="input-field pl-9"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        id="service-status-filter"
                        className="input-field w-full sm:w-44"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="table-wrap">
                    <div className="card-header flex items-center justify-between">
                        <div>
                            <p className="card-title">All services</p>
                            <p className="card-subtitle">{filtered.length} service{filtered.length !== 1 ? 's' : ''} found</p>
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
                                    <th>Service Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(service => (
                                    <tr key={service.id} className="group">
                                        <td className="font-medium text-text">{service.name}</td>
                                        <td className="max-w-xs truncate text-text-muted">
                                            {service.description || '—'}
                                        </td>
                                        <td className="font-medium text-text">{formatPrice(service.price)}</td>
                                        <td>{service.duration_minutes} mins</td>
                                        <td>
                                            <span className={`status-indicator ${service.status === 'active' ? 'status-active' : 'status-pending'}`}>
                                                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link href={`/admin/services/${service.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                                                    View
                                                </Link>
                                                <Link href={`/admin/services/${service.id}/edit`} className="text-sm font-medium text-text-muted hover:text-text">
                                                    Edit
                                                </Link>
                                                {service.status === 'active' && (
                                                    <button
                                                        className="text-sm font-medium text-amber-600 hover:text-amber-700"
                                                        onClick={() => disableService(service)}
                                                    >
                                                        Disable
                                                    </button>
                                                )}
                                                <button
                                                    className="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-40"
                                                    disabled={deletingId === service.id}
                                                    onClick={() => deleteService(service)}
                                                >
                                                    {deletingId === service.id ? 'Deleting…' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="table-empty">
                                            <div className="flex flex-col items-center gap-2 py-10">
                                                <svg className="h-10 w-10 text-text-muted opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path d="M9 12h6M9 8h6M9 16h4M7 4h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-text-muted">
                                                    {search || statusFilter ? 'No services match your filters.' : 'No services yet. Create your first service.'}
                                                </p>
                                                {!search && !statusFilter && (
                                                    <Link href="/admin/services/create" className="btn-primary btn-sm mt-1">
                                                        Create service
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
