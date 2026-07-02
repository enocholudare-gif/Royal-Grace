import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import ActivityTable from '../../Components/Dashboard/ActivityTable';
import ChartCard from '../../Components/Dashboard/ChartCard';
import MetricCard from '../../Components/Dashboard/MetricCard';
import NotificationFeed from '../../Components/Dashboard/NotificationFeed';
import { useDashboardData } from '../../Composables/useDashboardData';
import AdminLayout from '../../Layouts/AdminLayout';

export default function AdminDashboard() {
    const [dashboard, setDashboard] = useState({
        metrics: [],
        chartSeries: [],
        notifications: [],
        activity: [],
    });

    const dashboardColumns = [
        { key: 'reference', label: 'Booking' },
        { key: 'subject', label: 'Client' },
        { key: 'category', label: 'Service' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date' },
    ];

    const { loadAdminDashboard, loading, error } = useDashboardData();

    const [flashMessage, setFlashMessage] = useState(null);

    useEffect(() => {
        try {
            const value = localStorage.getItem('auth_flash_success');
            if (value) {
                setFlashMessage(value);
                localStorage.removeItem('auth_flash_success');
            }
        } catch (e) {
            // ignore
        }

        loadAdminDashboard().then(setDashboard).catch(() => {});
    }, [loadAdminDashboard]);

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {flashMessage && (
                    <div className="alert-success">
                        <span className="font-semibold">Success:</span>
                        <span>{flashMessage}</span>
                    </div>
                )}

                {error && (
                    <div className="alert-danger">
                        <span className="font-semibold">Unable to load dashboard:</span>
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {dashboard.metrics.map((metric) => (
                        <MetricCard
                            key={metric.label}
                            label={metric.label}
                            value={metric.value}
                            change={metric.change}
                            tone={metric.tone}
                        />
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                    <ChartCard
                        title="Revenue and booking momentum"
                        subtitle="Recent transactional activity across active operations."
                        series={dashboard.chartSeries}
                        colorClass="text-brand-600"
                    />

                    <NotificationFeed items={dashboard.notifications} title="Admin notifications" />
                </div>

                <ActivityTable
                    title="Latest bookings"
                    subtitle="Recent booking activity across clients and services."
                    columns={dashboardColumns}
                    rows={dashboard.activity}
                />

                {loading && (
                    <div className="card">
                        <div className="card-body text-sm text-text-muted">Loading dashboard...</div>
                    </div>
                )}
            </div>
        </>
    );
}

AdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
