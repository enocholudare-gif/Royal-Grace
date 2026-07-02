import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './AppLogo';

export default function AppSidebar({ navigation = [], roleLabel = 'Workspace' }) {
    const { url } = usePage();
    const currentUrl = url || '';

    const isActive = (item) => {
        if (!item?.href) {
            return false;
        }
        return currentUrl === item.href || currentUrl.startsWith(`${item.href}/`);
    };

    return (
        <aside className="hidden h-screen w-72 shrink-0 border-r border-border bg-surface xl:fixed xl:inset-y-0 xl:left-0 xl:z-50 xl:flex xl:flex-col">
            <div className="border-b border-border px-6 py-5">
                <AppLogo />
            </div>

            <div className="border-b border-border px-6 py-4">
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
                        >
                            <span
                                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                    active ? 'bg-brand-600 text-white' : 'bg-secondary-50 text-text-soft'
                                }`}
                                aria-hidden="true"
                            >
                                {IconComponent && <IconComponent className="h-5 w-5" />}
                            </span>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                                <span className={`badge ${active ? 'badge-primary' : 'badge-secondary'}`}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
