import React, { useState } from 'react';
import AppSidebar from '../Components/Layout/AppSidebar';
import AppMobileMenu from '../Components/Layout/AppMobileMenu';
import AppTopNavigation from '../Components/Layout/AppTopNavigation';
import NotificationsPanel from '../Components/Layout/NotificationsPanel';

export default function AppLayoutShell({ children, title = 'Dashboard', description = '', roleLabel = 'Workspace', navigation = [], user = {}, notifications = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

    const unreadCount = notifications.filter((item) => item.unread).length;

    return (
        <div className="min-h-screen bg-surface-muted">
            <AppSidebar navigation={navigation} roleLabel={roleLabel} />

            <AppMobileMenu
                open={mobileMenuOpen}
                navigation={navigation}
                roleLabel={roleLabel}
                onClose={() => setMobileMenuOpen(false)}
            />

            <NotificationsPanel
                open={notificationsPanelOpen}
                notifications={notifications}
                onClose={() => setNotificationsPanelOpen(false)}
            />

            <div className="min-h-screen xl:pl-72">
                <AppTopNavigation
                    title={title}
                    description={description}
                    user={user}
                    unreadCount={unreadCount}
                    onToggleMobileMenu={() => setMobileMenuOpen(true)}
                    onToggleNotifications={() => setNotificationsPanelOpen(!notificationsPanelOpen)}
                />

                <main className="container-page section-gap">
                    {children}
                </main>
            </div>
        </div>
    );
}
