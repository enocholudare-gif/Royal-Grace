import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import ActivityTable from '../../Components/Dashboard/ActivityTable';
import ChartCard from '../../Components/Dashboard/ChartCard';
import MetricCard from '../../Components/Dashboard/MetricCard';
import NotificationFeed from '../../Components/Dashboard/NotificationFeed';
import { useDashboardData } from '../../Composables/useDashboardData';
import CaregiverLayout from '../../Layouts/CaregiverLayout';

export default function CaregiverDashboard() {
    const [dashboard, setDashboard] = useState({
        metrics: [],
        chartSeries: [],
        notifications: [],
        activity: [],
    });

    const visitColumns = [
        { key: 'reference', label: 'Booking' },
        { key: 'subject', label: 'Client' },
        { key: 'category', label: 'Visit Status' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date' },
    ];

    const { loadCaregiverDashboard, loading, error } = useDashboardData();

    useEffect(() => {
        loadCaregiverDashboard().then(setDashboard).catch(() => {});
    }, [loadCaregiverDashboard]);

    return (
        <>
            <Head title="Caregiver Dashboard" />

            <div className="space-y-6">
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
                        title="Visit completion flow"
                        subtitle="Progress across your latest assigned visits."
                        series={dashboard.chartSeries}
                        colorClass="text-info-600"
                    />

                    <NotificationFeed items={dashboard.notifications} title="Care alerts" />
                </div>

                <ActivityTable
                    title="Visit activity"
                    subtitle="Check-in, check-out, and report progress."
                    columns={visitColumns}
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

CaregiverDashboard.layout = (page) => <CaregiverLayout>{page}</CaregiverLayout>;
