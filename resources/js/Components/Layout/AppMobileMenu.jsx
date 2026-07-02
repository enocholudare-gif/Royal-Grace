import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './AppLogo';

export default function AppMobileMenu({ open = false, navigation = [], roleLabel = 'Workspace', onClose }) {
    const { url } = usePage();
    const currentUrl = url || '';

    const isActive = (item) => {
        if (!item?.href) {
            return false;
        }
        return currentUrl === item.href || currentUrl.startsWith(`${item.href}/`);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 xl:hidden">
            <div className="absolute inset-0 bg-overlay" onClick={onClose} />

            <div className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-surface shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-5 py-5">
                    <AppLogo />

                    <button type="button" className="btn-secondary btn-sm" onClick={onClose}>
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="border-b border-border px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-soft">Active workspace</p>
                    <p className="mt-2 text-sm font-semibold text-text">{roleLabel}</p>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
                    {navigation.map((item) => {
                        const active = isActive(item);
                        const IconComponent = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href || '#'}
                                className={`panel-nav-link ${active ? 'panel-nav-link-active' : ''}`}
                                onClick={onClose}
                            >
                                <span
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                        active ? 'bg-brand-600 text-white' : 'bg-secondary-50 text-text-soft'
                                    }`}
                                >
                                    {IconComponent && <IconComponent className="h-5 w-5" />}
                                </span>
                                <span className="flex-1">{item.label}</span>
                                {item.badge && <span className="badge badge-secondary">{item.badge}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
