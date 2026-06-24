<script setup>
import AuthLayout from './AuthLayout.vue';
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
} from '../Components/Layout/icons';

const props = defineProps({
    title: {
        type: String,
        default: 'Admin Dashboard',
    },
    description: {
        type: String,
        default: 'Monitor platform operations, bookings, caregivers, and revenue.',
    },
    notifications: {
        type: Array,
        default: () => [
            { id: 1, title: 'New booking created', message: 'A client requested post-discharge care.', tone: 'info', time: '2 min ago', unread: true },
            { id: 2, title: 'Payment confirmed', message: 'Invoice RG-2026-014 has been paid successfully.', tone: 'success', time: '18 min ago', unread: true },
            { id: 3, title: 'Low rating alert', message: 'A caregiver visit received a 2-star rating and needs review.', tone: 'warning', time: '1 hour ago', unread: false },
        ],
    },
});

const navigation = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: DashboardIcon },
    { label: 'Calendar', href: '/admin/calendar', icon: CalendarIcon },
    { label: 'Bookings', href: '/admin/bookings', icon: ClipboardIcon },
    { label: 'Services', href: '/admin/services', icon: ServiceIcon },
    { label: 'Caregivers', href: '/admin/caregivers', icon: UsersIcon },
    { label: 'Clients', href: '/admin/clients', icon: HeartIcon },
    { label: 'Payments', href: '/admin/payments', icon: WalletIcon },
    { label: 'Reports', href: '/admin/reports', icon: ReportIcon },
    { label: 'Support', href: '/admin/support', icon: ChatIcon, badge: '3' },
];
</script>

<template>
    <AuthLayout
        :title="props.title"
        :description="props.description"
        role-label="Admin Workspace"
        :navigation="navigation"
        :notifications="props.notifications"
    >
        <slot />
    </AuthLayout>
</template>
