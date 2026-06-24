<script setup>
import { computed, ref } from 'vue';
import AppMobileMenu from '../Components/Layout/AppMobileMenu.vue';
import AppSidebar from '../Components/Layout/AppSidebar.vue';
import AppTopNavigation from '../Components/Layout/AppTopNavigation.vue';
import NotificationsPanel from '../Components/Layout/NotificationsPanel.vue';
import { useNotificationsPanel } from '../Composables/useNotificationsPanel';

const props = defineProps({
    title: {
        type: String,
        default: 'Dashboard',
    },
    description: {
        type: String,
        default: '',
    },
    roleLabel: {
        type: String,
        default: 'Workspace',
    },
    navigation: {
        type: Array,
        default: () => [],
    },
    user: {
        type: Object,
        default: () => ({}),
    },
    notifications: {
        type: Array,
        default: () => [],
    },
});

const mobileMenuOpen = ref(false);
const {
    isNotificationsPanelOpen,
    closeNotificationsPanel,
    toggleNotificationsPanel,
} = useNotificationsPanel();

const unreadCount = computed(() => props.notifications.filter((item) => item.unread).length);
</script>

<template>
    <div class="min-h-screen bg-surface-muted">
        <AppSidebar :navigation="navigation" :role-label="roleLabel" />

        <AppMobileMenu
            :open="mobileMenuOpen"
            :navigation="navigation"
            :role-label="roleLabel"
            @close="mobileMenuOpen = false"
        />

        <NotificationsPanel
            :open="isNotificationsPanelOpen"
            :notifications="notifications"
            @close="closeNotificationsPanel"
        />

        <div class="min-h-screen xl:pl-72">
            <AppTopNavigation
                :title="title"
                :description="description"
                :user="user"
                :unread-count="unreadCount"
                @toggle-mobile-menu="mobileMenuOpen = true"
                @toggle-notifications="toggleNotificationsPanel"
            />

            <main class="container-page section-gap">
                <slot />
            </main>
        </div>
    </div>
</template>
