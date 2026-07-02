import React from 'react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
                <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M12 21s-6.5-4.35-6.5-10A4.5 4.5 0 0 1 10 6.5c.86 0 1.66.24 2.3.66A4.45 4.45 0 0 1 14.6 6.5 4.5 4.5 0 0 1 19 11c0 5.65-7 10-7 10Z" />
                    <path d="M9.5 12h5" />
                    <path d="M12 9.5v5" />
                </svg>
            </div>

            <div>
                <p className="font-heading text-base font-semibold text-text">Royal Grace</p>
                <p className="text-xs text-text-soft">Care Management Platform</p>
            </div>
        </div>
    );
}
