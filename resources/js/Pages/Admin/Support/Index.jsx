import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchConversations = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/messages/conversations');
            setConversations(response.data.data || []);
        } catch (e) {
            setError('Failed to load support conversations. Please refresh and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Support & Messaging" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Support & Messaging</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Manage conversations with clients and caregivers.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="alert-danger">
                        <span className="font-semibold">Error:</span> {error}
                    </div>
                )}

                <div className="table-wrap">
                    <div className="card-header flex items-center justify-between">
                        <div>
                            <p className="card-title">Recent Conversations</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="divide-y divide-border">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="flex items-center gap-4 p-4">
                                    <div className="h-10 w-10 animate-pulse rounded-full bg-surface-subtle" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-32 animate-pulse rounded bg-surface-subtle" />
                                        <div className="h-3 w-48 animate-pulse rounded bg-surface-subtle" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {conversations.map(conv => (
                                <Link key={conv.id} href={`/messages?conversation=${conv.id}`} className="flex items-center gap-4 p-4 hover:bg-surface-subtle transition-colors group">
                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold uppercase">
                                        {(conv.participants?.[0]?.name || 'U').charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-sm font-medium text-text truncate">
                                                {conv.participants?.map(p => p.name).join(', ') || 'Unknown User'}
                                            </h3>
                                            <span className="text-xs text-text-soft flex-shrink-0 ml-2">
                                                {formatDate(conv.last_message_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-muted truncate">
                                            {conv.subject || 'Click to view conversation'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            {conversations.length === 0 && (
                                <div className="p-8 text-center">
                                    <svg className="h-10 w-10 text-text-muted opacity-40 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-sm text-text-muted">No support conversations found.</p>
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
