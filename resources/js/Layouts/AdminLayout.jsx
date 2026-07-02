import React from 'react';
import { usePage } from '@inertiajs/react';
import AuthLayout from './AuthLayout';
import {
    CalendarIcon,
    ChatIcon,
    ClipboardIcon,
    DashboardIcon,
    HeartIcon,
    ReportIcon,
    ServiceIcon,
    UsersIcon,
    WalletIcon,
    StarIcon,
    SettingsIcon,
    ShieldIcon,
} from '../Components/Layout/icons';

export default function AdminLayout({ children, title = 'Admin Dashboard', description = 'Monitor platform operations, bookings, caregivers, and revenue.', notifications = [
    { id: 1, title: 'New booking created', message: 'A client requested post-discharge care.', tone: 'info', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment confirmed', message: 'Invoice RG-2026-014 has been paid successfully.', tone: 'success', time: '18 min ago', unread: true },
    { id: 3, title: 'Low rating alert', message: 'A caregiver visit received a 2-star rating and needs review.', tone: 'warning', time: '1 hour ago', unread: false },
] }) {
    const { auth } = usePage().props;
    const isSuperAdmin = auth?.user?.role === 'super-admin';

    const navigation = [
        { label: 'Dashboard', href: isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard', icon: DashboardIcon },
        { label: 'Calendar', href: '/admin/calendar', icon: CalendarIcon },
        { label: 'Bookings', href: '/admin/bookings', icon: ClipboardIcon },
        { label: 'Services', href: '/admin/services', icon: ServiceIcon },
        { label: 'Caregivers', href: '/admin/caregivers', icon: UsersIcon },
        { label: 'Clients', href: '/admin/clients', icon: HeartIcon },
        { label: 'Payments', href: '/admin/payments', icon: WalletIcon },
        { label: 'Reports', href: '/admin/reports', icon: ReportIcon },
        { label: 'Reviews', href: '/admin/ratings', icon: StarIcon },
        { label: 'Support', href: '/admin/support', icon: ChatIcon, badge: '3' },
    ];

    if (isSuperAdmin) {
        navigation.push({ label: 'Manage Admins', href: '/super-admin/admins', icon: ShieldIcon });
        navigation.push({ label: 'Platform Settings', href: '/super-admin/settings', icon: SettingsIcon });
    }

    return (
        <AuthLayout
            title={title}
            description={description}
            roleLabel="Admin Workspace"
            navigation={navigation}
            notifications={notifications}
        >
            {children}
        </AuthLayout>
    );
}
