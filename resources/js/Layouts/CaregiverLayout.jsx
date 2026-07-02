import React from 'react';
import AuthLayout from './AuthLayout';
import {
    CalendarIcon,
    ChatIcon,
    ClipboardIcon,
    ClockIcon,
    HomeIcon,
} from '../Components/Layout/icons';

export default function CaregiverLayout({ children, title = 'Caregiver Workspace', description = 'Manage visits, schedules, and client care updates on the go.', notifications = [
    { id: 1, title: 'Visit starts soon', message: 'Your next home care visit starts at 10:00 AM.', tone: 'info', time: '5 min ago', unread: true },
    { id: 2, title: 'Schedule updated', message: 'A client shifted tomorrow\'s appointment by 30 minutes.', tone: 'warning', time: '34 min ago', unread: false },
] }) {
    const navigation = [
        { label: 'Overview', href: '/caregiver/dashboard', icon: HomeIcon },
        { label: 'Schedule', href: '/caregiver/schedule', icon: CalendarIcon },
        { label: 'Visit Reports', href: '/caregiver/visits', icon: ClipboardIcon },
        { label: 'Attendance', href: '/caregiver/attendance', icon: ClockIcon },
        { label: 'Messages', href: '/messages', icon: ChatIcon },
    ];

    return (
        <AuthLayout
            title={title}
            description={description}
            roleLabel="Caregiver Workspace"
            navigation={navigation}
            notifications={notifications}
        >
            {children}
        </AuthLayout>
    );
}
