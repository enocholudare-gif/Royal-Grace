import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { NotificationDropdown } from '../Notifications/NotificationDropdown';

export default function AppTopNavigation({ title = 'Dashboard', description = '', user = {}, unreadCount = 0, onToggleMobileMenu, onToggleNotifications }) {
    const { props: pageProps } = usePage();
    const canLogout = Boolean(pageProps?.auth?.user);

    const name = user?.name?.trim();
    const initials = name
        ? name
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('')
        : 'RG';

    return (
        <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
            <div className="container-page flex min-h-20 items-center justify-between gap-4 py-4">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        className="btn-secondary btn-sm xl:hidden"
                        onClick={onToggleMobileMenu}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                        </svg>
                    </button>

                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-semibold md:text-2xl">{title}</h1>
                        {description && (
                            <p className="truncate text-sm text-text-muted">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <NotificationDropdown />

                    <div className="hidden items-center gap-3 rounded-xl border border-border bg-surface-subtle px-3 py-2 md:flex">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
                            {initials}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-text">{user?.name || 'Royal Grace User'}</p>
                            <p className="truncate text-xs text-text-soft">{user?.email || 'care@royalgrace.local'}</p>
                        </div>
                    </div>

                    {canLogout && (
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            type="button"
                            className="btn-primary btn-sm ml-2"
                        >
                            Logout
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
