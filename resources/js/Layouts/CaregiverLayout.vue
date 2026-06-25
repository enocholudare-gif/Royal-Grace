<script setup>
import AuthLayout from './AuthLayout.vue';
import {
    CalendarIcon,
    ChatIcon,
    ClipboardIcon,
    ClockIcon,
    HomeIcon,
} from '../Components/Layout/icons';

const props = defineProps({
    title: {
        type: String,
        default: 'Caregiver Workspace',
    },
    description: {
        type: String,
        default: 'Manage visits, schedules, and client care updates on the go.',
    },
    notifications: {
        type: Array,
        default: () => [
            { id: 1, title: 'Visit starts soon', message: 'Your next home care visit starts at 10:00 AM.', tone: 'info', time: '5 min ago', unread: true },
            { id: 2, title: 'Schedule updated', message: 'A client shifted tomorrow\'s appointment by 30 minutes.', tone: 'warning', time: '34 min ago', unread: false },
        ],
    },
});

const navigation = [
    { label: 'Overview', href: '/caregiver/dashboard', icon: HomeIcon },
    { label: 'Schedule', href: '/caregiver/schedule', icon: CalendarIcon },
    { label: 'Visit Reports', href: '/caregiver/visits', icon: ClipboardIcon },
    { label: 'Attendance', href: '/caregiver/attendance', icon: ClockIcon },
    { label: 'Messages', href: '/messages', icon: ChatBubbleOvalLeftIcon },
];
</script>

<template>
    <AuthLayout
        :title="title"
        :description="description"
        role-label="Caregiver Workspace"
        :navigation="navigation"
        :notifications="notifications"
    >
        <slot />
    </AuthLayout>
</template>
