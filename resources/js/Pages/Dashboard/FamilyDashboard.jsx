import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import ActivityTable from '../../Components/Dashboard/ActivityTable';
import ChartCard from '../../Components/Dashboard/ChartCard';
import MetricCard from '../../Components/Dashboard/MetricCard';
import NotificationFeed from '../../Components/Dashboard/NotificationFeed';
import { useDashboardData } from '../../Composables/useDashboardData';
import FamilyLayout from '../../Layouts/FamilyLayout';

export default function FamilyDashboard() {
    const [dashboard, setDashboard] = useState({
        metrics: [],
        chartSeries: [],
        notifications: [],
        activity: [],
    });

    const visitColumns = [
        { key: 'reference', label: 'Booking' },
        { key: 'subject', label: 'Caregiver' },
        { key: 'category', label: 'Client Condition' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date' },
    ];

    const { loadFamilyDashboard, loading, error } = useDashboardData();

    useEffect(() => {
        loadFamilyDashboard().then(setDashboard).catch(() => {});
    }, [loadFamilyDashboard]);

    return (
        <>
            <Head title="Family Dashboard" />

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

                <div className="grid gap-6">
                    <NotificationFeed items={dashboard.notifications} title="Recent Updates on Loved Ones" />
                </div>

                <ActivityTable
                    title="Completed visits"
                    subtitle="Latest visit outcomes and care observations."
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

FamilyDashboard.layout = (page) => <FamilyLayout>{page}</FamilyLayout>;
