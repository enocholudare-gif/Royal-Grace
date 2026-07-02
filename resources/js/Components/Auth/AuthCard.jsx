import React from 'react';

export default function AuthCard({ title = '', subtitle = '', children }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-text">{title}</h2>
                {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}
