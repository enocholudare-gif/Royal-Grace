<script setup>
import AuthLayout from './AuthLayout.vue';
import {
    BellIcon,
    CalendarIcon,
    HomeIcon,
    ReportIcon,
    WalletIcon,
    ChatIcon,
} from '../Components/Layout/icons';

const props = defineProps({
    title: {
        type: String,
        default: 'Family Portal',
    },
    description: {
        type: String,
        default: 'Track care delivery, view updates, invoices, and visit summaries for loved ones.',
    },
    notifications: {
        type: Array,
        default: () => [
            { id: 1, title: 'Visit completed', message: 'A caregiver completed today\'s visit and submitted a report.', tone: 'success', time: '8 min ago', unread: true },
            { id: 2, title: 'New message', message: 'The admin team sent an update about an upcoming visit.', tone: 'info', time: '28 min ago', unread: true },
        ],
    },
});

const navigation = [
    { label: 'Overview', href: '/family/dashboard', icon: HomeIcon },
    { label: 'Upcoming Bookings', href: '/family/bookings', icon: CalendarIcon },
    { label: 'Visit Reports', href: '/family/reports', icon: ReportIcon },
    { label: 'Invoices', href: '/family/invoices', icon: WalletIcon },
    { label: 'Messages', href: '/family/messages', icon: ChatIcon },
    { label: 'Notifications', href: '/family/notifications', icon: BellIcon, badge: '2' },
];
</script>

<template>
    <AuthLayout
        :title="title"
        :description="description"
        role-label="Family Portal"
        :navigation="navigation"
        :notifications="notifications"
    >
        <slot />
    </AuthLayout>
</template>
