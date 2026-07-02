import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, revenue, bookings, caregivers, clients
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    // Filters
    const [filters, setFilters] = useState({
        timeframe: 'monthly',
        from: '',
        to: '',
        booking_status: '',
    });

    const formatCurrency = (val) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val || 0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await axios.get(`/reports/${activeTab}?${params}`);
            setData(response.data);
        } catch (err) {
            setError('Failed to fetch report data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [activeTab, filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleExport = async (format) => {
        try {
            setLoading(true);
            const payload = {
                ...filters,
                type: activeTab === 'dashboard' ? 'revenue' : activeTab
            };
            
            const response = await axios.post(`/reports/export/${format}`, payload, {
                responseType: 'blob' // Important for downloading files
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${activeTab}_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError(`Failed to export ${format.toUpperCase()}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard Analytics' },
        { id: 'revenue', label: 'Revenue Report' },
        { id: 'bookings', label: 'Booking Report' },
        { id: 'caregivers', label: 'Caregiver Performance' },
        { id: 'clients', label: 'Client Insights' },
    ];

    return (
        <>
            <Head title="Reports & Analytics" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Reports & Analytics</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Gain insights into your business performance, revenue, and operations.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleExport('excel')} className="btn-secondary text-sm">
                            Export Excel
                        </button>
                        <button onClick={() => handleExport('pdf')} className="btn-secondary text-sm">
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Master Filter Bar */}
                <div className="card p-4 flex flex-wrap items-end gap-4 bg-surface">
                    <div className="w-full sm:w-auto flex-1 min-w-[150px]">
                        <label className="form-label text-xs">Period</label>
                        <select name="timeframe" value={filters.timeframe} onChange={handleFilterChange} className="input-field py-2 text-sm">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="custom">Custom Date Range</option>
                        </select>
                    </div>
                    
                    {filters.timeframe === 'custom' && (
                        <>
                            <div className="w-full sm:w-auto flex-1 min-w-[150px]">
                                <label className="form-label text-xs">Start Date</label>
                                <input type="date" name="from" value={filters.from} onChange={handleFilterChange} className="input-field py-2 text-sm" />
                            </div>
                            <div className="w-full sm:w-auto flex-1 min-w-[150px]">
                                <label className="form-label text-xs">End Date</label>
                                <input type="date" name="to" value={filters.to} onChange={handleFilterChange} className="input-field py-2 text-sm" />
                            </div>
                        </>
                    )}

                    <div className="w-full sm:w-auto flex-1 min-w-[150px]">
                        <label className="form-label text-xs">Status</label>
                        <select name="booking_status" value={filters.booking_status} onChange={handleFilterChange} className="input-field py-2 text-sm">
                            <option value="">All Statuses</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="active">Active</option>
                        </select>
                    </div>

                    <button onClick={fetchData} disabled={loading} className="btn-primary py-2 px-4 h-[42px] whitespace-nowrap">
                        {loading ? 'Applying...' : 'Apply Filters'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-border">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                                    ${activeTab === tab.id
                                        ? 'border-brand-500 text-brand-600'
                                        : 'border-transparent text-text-muted hover:border-border hover:text-text'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="min-h-[400px]">
                    {error && (
                        <div className="alert-danger mb-4">
                            <span className="font-semibold">Error:</span> {error}
                        </div>
                    )}
                    
                    {loading && !data ? (
                        <div className="flex flex-col gap-4">
                            <div className="h-24 w-full animate-pulse rounded bg-surface-subtle" />
                            <div className="h-64 w-full animate-pulse rounded bg-surface-subtle" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Dashboard Tab */}
                            {activeTab === 'dashboard' && data?.data && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="card p-6 border-t-4 border-brand-500">
                                        <p className="text-sm font-medium text-text-muted">Total Clients</p>
                                        <p className="mt-2 text-3xl font-bold text-text">{data.data.total_clients}</p>
                                    </div>
                                    <div className="card p-6 border-t-4 border-emerald-500">
                                        <p className="text-sm font-medium text-text-muted">Active Caregivers</p>
                                        <p className="mt-2 text-3xl font-bold text-text">{data.data.active_caregivers}</p>
                                    </div>
                                    <div className="card p-6 border-t-4 border-blue-500">
                                        <p className="text-sm font-medium text-text-muted">Total Revenue</p>
                                        <p className="mt-2 text-3xl font-bold text-text">{formatCurrency(data.data.revenue)}</p>
                                    </div>
                                    <div className="card p-6">
                                        <p className="text-sm font-medium text-text-muted">Active Bookings</p>
                                        <p className="mt-2 text-3xl font-bold text-text">{data.data.active_bookings}</p>
                                    </div>
                                    <div className="card p-6">
                                        <p className="text-sm font-medium text-text-muted">Upcoming Visits</p>
                                        <p className="mt-2 text-3xl font-bold text-text">{data.data.upcoming_visits}</p>
                                    </div>
                                    <div className="card p-6 border-t-4 border-rose-500">
                                        <p className="text-sm font-medium text-text-muted">Cancellation Rate</p>
                                        <p className="mt-2 text-3xl font-bold text-text">{data.data.cancellation_rate}%</p>
                                    </div>
                                </div>
                            )}

                            {/* Revenue Tab */}
                            {activeTab === 'revenue' && data?.data && (
                                <div className="card">
                                    <div className="p-6 border-b border-border flex items-center justify-between">
                                        <h3 className="font-semibold text-lg text-text">Revenue Breakdown</h3>
                                        <div className="text-right">
                                            <p className="text-sm text-text-muted">Total Revenue</p>
                                            <p className="text-xl font-bold text-brand-600">{formatCurrency(data.data.total_revenue)}</p>
                                        </div>
                                    </div>
                                    <table className="table-standard w-full">
                                        <thead>
                                            <tr>
                                                <th>Service Name</th>
                                                <th className="text-right">Completed Bookings</th>
                                                <th className="text-right">Revenue Generated</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.data.breakdown?.length > 0 ? data.data.breakdown.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="font-medium">{item.service}</td>
                                                    <td className="text-right">{item.count}</td>
                                                    <td className="text-right font-medium">{formatCurrency(item.revenue)}</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="3" className="text-center py-6 text-text-muted">No revenue data for this period.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Bookings Tab */}
                            {activeTab === 'bookings' && data?.data && (
                                <div className="card">
                                    <div className="p-6 border-b border-border flex items-center justify-between">
                                        <h3 className="font-semibold text-lg text-text">Booking Statistics</h3>
                                        <div className="text-right">
                                            <p className="text-sm text-text-muted">Total Bookings</p>
                                            <p className="text-xl font-bold text-brand-600">{data.data.total_bookings}</p>
                                        </div>
                                    </div>
                                    <table className="table-standard w-full">
                                        <thead>
                                            <tr>
                                                <th>Status</th>
                                                <th className="text-right">Count</th>
                                                <th className="text-right">Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.data.by_status && Object.entries(data.data.by_status).map(([status, count]) => (
                                                <tr key={status}>
                                                    <td className="capitalize font-medium">{status}</td>
                                                    <td className="text-right">{count}</td>
                                                    <td className="text-right">
                                                        {data.data.total_bookings ? Math.round((count / data.data.total_bookings) * 100) : 0}%
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!data.data.by_status || Object.keys(data.data.by_status).length === 0) && (
                                                <tr><td colSpan="3" className="text-center py-6 text-text-muted">No booking data for this period.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Caregivers Tab */}
                            {activeTab === 'caregivers' && data?.data && (
                                <div className="card">
                                    <div className="p-6 border-b border-border">
                                        <h3 className="font-semibold text-lg text-text">Caregiver Performance</h3>
                                    </div>
                                    <table className="table-standard w-full">
                                        <thead>
                                            <tr>
                                                <th>Caregiver Name</th>
                                                <th className="text-right">Visits Completed</th>
                                                <th className="text-right">Total Hours</th>
                                                <th className="text-right">Average Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.data.performance?.length > 0 ? data.data.performance.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="font-medium">{item.name}</td>
                                                    <td className="text-right">{item.visits}</td>
                                                    <td className="text-right">{item.hours}h</td>
                                                    <td className="text-right">
                                                        <span className="inline-flex items-center gap-1 text-amber-500 font-medium">
                                                            {item.rating} <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="4" className="text-center py-6 text-text-muted">No performance data for this period.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Clients Tab */}
                            {activeTab === 'clients' && data?.data && (
                                <div className="card">
                                    <div className="p-6 border-b border-border flex items-center justify-between">
                                        <h3 className="font-semibold text-lg text-text">Client Demographics & Insights</h3>
                                        <div className="text-right">
                                            <p className="text-sm text-text-muted">New Clients</p>
                                            <p className="text-xl font-bold text-brand-600">+{data.data.new_clients}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 border-b border-border">
                                        <p className="text-sm text-text-muted">Total Clients: <strong className="text-text">{data.data.total_clients}</strong></p>
                                    </div>
                                    <table className="table-standard w-full">
                                        <thead>
                                            <tr>
                                                <th>Status</th>
                                                <th className="text-right">Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.data.by_status && Object.entries(data.data.by_status).map(([status, count]) => (
                                                <tr key={status}>
                                                    <td className="capitalize font-medium">{status}</td>
                                                    <td className="text-right">{count}</td>
                                                </tr>
                                            ))}
                                            {(!data.data.by_status || Object.keys(data.data.by_status).length === 0) && (
                                                <tr><td colSpan="2" className="text-center py-6 text-text-muted">No client data for this period.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <AdminLayout>{page}</AdminLayout>;
