<script setup>
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import AppLayoutShell from './AppLayoutShell.vue';

const props = defineProps({
    title: {
        type: String,
        default: 'Workspace',
    },
    description: {
        type: String,
        default: 'Manage your healthcare operations from one place.',
    },
    roleLabel: {
        type: String,
        default: 'Authenticated User',
    },
    navigation: {
        type: Array,
        default: () => [],
    },
    notifications: {
        type: Array,
        default: () => [],
    },
});

const page = usePage();
const user = computed(() => page.props?.auth?.user ?? {});
</script>

<template>
    <AppLayoutShell
        :title="title"
        :description="description"
        :role-label="roleLabel"
        :navigation="navigation"
        :notifications="notifications"
        :user="user"
    >
        <slot />
    </AppLayoutShell>
</template>
