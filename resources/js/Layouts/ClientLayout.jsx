import React from 'react';
import AuthLayout from './AuthLayout';
import {
    CalendarIcon,
    FileIcon,
    HeartIcon,
    HomeIcon,
    WalletIcon,
    ChatIcon,
    StarIcon
} from '../Components/Layout/icons';

export default function ClientLayout({ children, title = 'Client Portal', description = 'Review your care plans, bookings, invoices, and visit updates.', notifications = [
    { id: 1, title: 'Booking confirmed', message: 'Your home support booking for tomorrow is confirmed.', tone: 'success', time: '12 min ago', unread: true },
    { id: 2, title: 'Invoice available', message: 'A new invoice is ready for review and payment.', tone: 'info', time: '1 day ago', unread: false },
] }) {
    const navigation = [
        { label: 'Overview', href: '/client/dashboard', icon: HomeIcon },
        { label: 'Bookings', href: '/client/bookings', icon: CalendarIcon },
        { label: 'Book a Service', href: '/client/services', icon: HeartIcon },
        { label: 'Invoices', href: '/client/invoices', icon: WalletIcon },
        { label: 'Reports', href: '/client/reports', icon: FileIcon },
        { label: 'My Reviews', href: '/client/ratings', icon: StarIcon },
        { label: 'Messages', href: '/messages', icon: ChatIcon },
    ];

    return (
        <AuthLayout
            title={title}
            description={description}
            roleLabel="Client Portal"
            navigation={navigation}
            notifications={notifications}
        >
            {children}
        </AuthLayout>
    );
}
