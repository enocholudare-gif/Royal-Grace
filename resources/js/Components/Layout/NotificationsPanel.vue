<script setup>
const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    notifications: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['close']);

const toneClass = (tone) => {
    switch (tone) {
        case 'success':
            return 'badge-success';
        case 'warning':
            return 'badge-warning';
        case 'danger':
            return 'badge-danger';
        case 'info':
            return 'badge-info';
        default:
            return 'badge-secondary';
    }
};
</script>

<template>
    <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
    >
        <div v-if="open" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-overlay/60" @click="emit('close')" />

            <aside class="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-lg">
                <div class="flex items-center justify-between border-b border-border px-5 py-4">
                    <div>
                        <h2 class="text-lg font-semibold text-text">Notifications</h2>
                        <p class="text-sm text-text-muted">Stay updated on bookings, visits, and messages.</p>
                    </div>

                    <button type="button" class="btn-secondary btn-sm" @click="emit('close')">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="m6 6 12 12M18 6 6 18" stroke-linecap="round" />
                        </svg>
                    </button>
                </div>

                <div class="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                    <div
                        v-for="notification in notifications"
                        :key="notification.id"
                        class="rounded-2xl border border-border bg-surface-muted p-4"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="text-sm font-semibold text-text">{{ notification.title }}</p>
                                <p class="mt-1 text-sm text-text-muted">{{ notification.message }}</p>
                            </div>

                            <span class="badge" :class="toneClass(notification.tone)">
                                {{ notification.tone || 'update' }}
                            </span>
                        </div>

                        <div class="mt-3 flex items-center justify-between gap-3">
                            <p class="text-xs text-text-soft">{{ notification.time }}</p>
                            <span v-if="notification.unread" class="badge-primary badge">New</span>
                        </div>
                    </div>

                    <div v-if="notifications.length === 0" class="table-empty rounded-2xl border border-dashed border-border bg-surface-muted">
                        No notifications yet.
                    </div>
                </div>
            </aside>
        </div>
    </transition>
</template>
