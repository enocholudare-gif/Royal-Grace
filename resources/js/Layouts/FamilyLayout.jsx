import React from 'react';
import AuthLayout from './AuthLayout';
import {
    BellIcon,
    CalendarIcon,
    HomeIcon,
    ReportIcon,
    WalletIcon,
    StarIcon,
    ChatIcon,
} from '../Components/Layout/icons';

export default function FamilyLayout({ children, title = 'Family Portal', description = 'Track care delivery, view updates, invoices, and visit summaries for loved ones.', notifications = [
    { id: 1, title: 'Visit completed', message: 'A caregiver completed today\'s visit and submitted a report.', tone: 'success', time: '8 min ago', unread: true },
    { id: 2, title: 'New message', message: 'The admin team sent an update about an upcoming visit.', tone: 'info', time: '28 min ago', unread: true },
] }) {
    const navigation = [
        { label: 'Overview', href: '/family/dashboard', icon: HomeIcon },
        { label: 'Upcoming Bookings', href: '/family/bookings', icon: CalendarIcon },
        { label: 'Visit Reports', href: '/family/reports', icon: ReportIcon },
        { label: 'Invoices', href: '/family/invoices', icon: WalletIcon },
        { label: 'My Reviews', href: '/family/ratings', icon: StarIcon },
        { label: 'Messages', href: '/family/messages', icon: ChatIcon },
        { label: 'Notifications', href: '/family/notifications', icon: BellIcon, badge: '2' },
    ];

    return (
        <AuthLayout
            title={title}
            description={description}
            roleLabel="Family Portal"
            navigation={navigation}
            notifications={notifications}
        >
            {children}
        </AuthLayout>
    );
}
