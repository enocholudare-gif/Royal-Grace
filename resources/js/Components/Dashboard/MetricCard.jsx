import React from 'react';

export default function MetricCard({ label, value, change = '', trend = 'up', tone = 'primary' }) {
    const toneMap = {
        primary: 'bg-brand-100 text-brand-800',
        success: 'bg-success-100 text-success-700',
        warning: 'bg-warning-100 text-warning-700',
        danger: 'bg-danger-100 text-danger-700',
        info: 'bg-info-100 text-info-700',
    };

    return (
        <div className="metric-card">
            <div className="flex items-start justify-between gap-4">
                <p className="metric-label">{label}</p>
                <span className={`badge ${toneMap[tone] || toneMap.primary}`}>
                    {tone}
                </span>
            </div>

            <p className="metric-value">{value}</p>

            {change && (
                <p className={trend === 'down' ? 'metric-trend-down' : 'metric-trend-up'}>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path
                            d={trend === 'down' ? 'm7 7 10 10M7 17h10V7' : 'm7 17 10-10M7 7h10v10'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {change}
                </p>
            )}
        </div>
    );
}
