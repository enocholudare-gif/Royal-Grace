import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import FamilyLayout from '../../../Layouts/FamilyLayout';

export default function Index() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchNotifications = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/api/family/notifications');
            setNotifications(response.data.data || []);
        } catch (e) {
            setError('Failed to load notifications. Please refresh and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        // Implement mark as read API call
        setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    };

    const markAllRead = async () => {
        // Implement mark all as read API call
        setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
    };

    const deleteNotification = async (id) => {
        // Implement delete API call
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Just now';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Notifications" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Notifications</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Stay updated on bookings, visit reports, and payment status.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="btn-secondary btn-sm" onClick={markAllRead}>
                            Mark all as read
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="alert-danger">
                        <span className="font-semibold">Error:</span> {error}
                    </div>
                )}

                <div className="card">
                    <div className="divide-y divide-border">
                        {loading ? (
                            [1, 2, 3, 4].map(n => (
                                <div key={n} className="flex items-start gap-4 p-4">
                                    <div className="h-10 w-10 animate-pulse rounded-full bg-surface-subtle shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/3 animate-pulse rounded bg-surface-subtle" />
                                        <div className="h-3 w-1/2 animate-pulse rounded bg-surface-subtle" />
                                    </div>
                                </div>
                            ))
                        ) : notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div key={notification.id} className={`flex items-start gap-4 p-4 transition-colors ${!notification.read_at ? 'bg-brand-50/30' : 'hover:bg-surface-subtle'}`}>
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${!notification.read_at ? 'bg-brand-100 text-brand-600' : 'bg-surface-muted text-text-soft'}`}>
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.17V11a6 6 0 1 0-12 0v3.17a2 2 0 0 1-.6 1.42L4 17h5M10 17a2 2 0 0 0 4 0" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm ${!notification.read_at ? 'font-semibold text-text' : 'font-medium text-text-muted'}`}>
                                                {notification.data?.title || 'Notification'}
                                            </p>
                                            <p className="text-xs text-text-soft whitespace-nowrap">
                                                {formatDateTime(notification.created_at)}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-sm text-text-muted">
                                            {notification.data?.message || notification.data?.body || 'A new update is available.'}
                                        </p>
                                        <div className="mt-3 flex items-center gap-3">
                                            {!notification.read_at && (
                                                <button onClick={() => markAsRead(notification.id)} className="text-xs font-medium text-brand-600 hover:text-brand-800">
                                                    Mark as read
                                                </button>
                                            )}
                                            <button onClick={() => deleteNotification(notification.id)} className="text-xs font-medium text-danger-600 hover:text-danger-800">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle mb-4">
                                    <svg className="h-6 w-6 text-text-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-text">No notifications</h3>
                                <p className="mt-1 text-sm text-text-muted max-w-sm">
                                    You're all caught up! When there are updates to your bookings, visits, or invoices, they will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Index.layout = page => <FamilyLayout>{page}</FamilyLayout>;
