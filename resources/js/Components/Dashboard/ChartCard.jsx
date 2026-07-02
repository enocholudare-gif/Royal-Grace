import React from 'react';

export default function ChartCard({ title, subtitle = '', series = [], colorClass = 'text-brand-600' }) {
    const maxValue = Math.max(...series.map((item) => Number(item.value || 0)), 1);

    return (
        <div className="card">
            <div className="card-header">
                <div>
                    <p className="card-title">{title}</p>
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
            </div>

            <div className="card-body">
                <div className="flex h-64 items-end gap-3">
                    {series.map((item, index) => {
                        const heightPct = Math.max((Number(item.value || 0) / maxValue) * 100, 6);
                        return (
                            <div
                                key={item.label || index}
                                className="flex min-w-0 flex-1 flex-col items-center gap-3"
                            >
                                <div className="flex h-52 w-full items-end">
                                    <div className="w-full rounded-t-2xl bg-secondary-100">
                                        <div
                                            className={`w-full rounded-t-2xl transition-all duration-300 ${colorClass}`}
                                            style={{ height: `${heightPct}%`, backgroundColor: 'currentColor' }}
                                        />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm font-semibold text-text">{item.value}</p>
                                    <p className="truncate text-xs text-text-soft">{item.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
