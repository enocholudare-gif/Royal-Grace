import React from 'react';

export default function NotificationsPanel({ open = false, notifications = [], onClose }) {
    const toneClass = (tone) => {
        switch (tone) {
            case 'success':
                return 'badge-success';
            case 'warning':
                return 'badge-warning';
            case 'danger':
                return 'badge-danger';
            case 'info':
                return 'badge-info';
            default:
                return 'badge-secondary';
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-overlay/60" onClick={onClose} />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Notifications</h2>
                        <p className="text-sm text-text-muted">Stay updated on bookings, visits, and messages.</p>
                    </div>

                    <button type="button" className="btn-secondary btn-sm" onClick={onClose}>
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="rounded-2xl border border-border bg-surface-muted p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-text">{notification.title}</p>
                                    <p className="mt-1 text-sm text-text-muted">{notification.message}</p>
                                </div>

                                <span className={`badge ${toneClass(notification.tone)}`}>
                                    {notification.tone || 'update'}
                                </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                                <p className="text-xs text-text-soft">{notification.time}</p>
                                {notification.unread && <span className="badge-primary badge">New</span>}
                            </div>
                        </div>
                    ))}

                    {notifications.length === 0 && (
                        <div className="table-empty rounded-2xl border border-dashed border-border bg-surface-muted">
                            No notifications yet.
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}
