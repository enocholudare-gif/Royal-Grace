<script setup>
import AuthLayout from './AuthLayout.vue';
import {
    CalendarIcon,
    FileIcon,
    HeartIcon,
    HomeIcon,
    WalletIcon,
} from '../Components/Layout/icons';

const props = defineProps({
    title: {
        type: String,
        default: 'Client Portal',
    },
    description: {
        type: String,
        default: 'Review your care plans, bookings, invoices, and visit updates.',
    },
    notifications: {
        type: Array,
        default: () => [
            { id: 1, title: 'Booking confirmed', message: 'Your home support booking for tomorrow is confirmed.', tone: 'success', time: '12 min ago', unread: true },
            { id: 2, title: 'Invoice available', message: 'A new invoice is ready for review and payment.', tone: 'info', time: '1 day ago', unread: false },
        ],
    },
});

const navigation = [
    { label: 'Overview', href: '/client/dashboard', icon: HomeIcon },
    { label: 'Bookings', href: '/client/bookings', icon: CalendarIcon },
    { label: 'Care Plans', href: '/client/services', icon: HeartIcon },
    { label: 'Invoices', href: '/client/invoices', icon: WalletIcon },
    { label: 'Reports', href: '/client/reports', icon: FileIcon },
];
</script>

<template>
    <AuthLayout
        :title="title"
        :description="description"
        role-label="Client Portal"
        :navigation="navigation"
        :notifications="notifications"
    >
        <slot />
    </AuthLayout>
</template>
