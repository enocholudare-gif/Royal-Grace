import React from 'react';

export default function AuthAlert({ tone = 'info', title = '', message = '' }) {
    const toneClassMap = {
        info: 'alert-info',
        success: 'alert-success',
        warning: 'alert-warning',
        danger: 'alert-danger',
    };

    return (
        <div className={`alert ${toneClassMap[tone] || toneClassMap.info}`}>
            <div className="mt-0.5">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                    <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <div className="min-w-0">
                {title && <p className="font-semibold">{title}</p>}
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
}
