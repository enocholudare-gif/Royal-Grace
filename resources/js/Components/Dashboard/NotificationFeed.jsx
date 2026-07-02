import React from 'react';

export default function NotificationFeed({ items = [], title = 'Notifications' }) {
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

    return (
        <div className="card">
            <div className="card-header">
                <div>
                    <p className="card-title">{title}</p>
                    <p className="card-subtitle">Recent activity and system alerts.</p>
                </div>
            </div>

            <div className="card-body space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-2xl border border-border bg-surface-muted p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-text">{item.title}</p>
                                <p className="mt-1 text-sm text-text-muted">{item.message}</p>
                            </div>
                            <span className={`badge ${toneClass(item.tone)}`}>
                                {item.tone || 'update'}
                            </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-xs text-text-soft">{item.time}</p>
                            {item.unread && <span className="badge-primary badge">New</span>}
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="table-empty rounded-2xl border border-dashed border-border bg-surface-muted">
                        No recent notifications.
                    </div>
                )}
            </div>
        </div>
    );
}
