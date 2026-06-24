<script setup>
defineProps({
    items: {
        type: Array,
        default: () => [],
    },
    title: {
        type: String,
        default: 'Notifications',
    },
});

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
    <div class="card">
        <div class="card-header">
            <div>
                <p class="card-title">{{ title }}</p>
                <p class="card-subtitle">Recent activity and system alerts.</p>
            </div>
        </div>

        <div class="card-body space-y-4">
            <div
                v-for="item in items"
                :key="item.id"
                class="rounded-2xl border border-border bg-surface-muted p-4"
            >
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <p class="text-sm font-semibold text-text">{{ item.title }}</p>
                        <p class="mt-1 text-sm text-text-muted">{{ item.message }}</p>
                    </div>
                    <span class="badge" :class="toneClass(item.tone)">
                        {{ item.tone || 'update' }}
                    </span>
                </div>

                <div class="mt-3 flex items-center justify-between gap-3">
                    <p class="text-xs text-text-soft">{{ item.time }}</p>
                    <span v-if="item.unread" class="badge-primary badge">New</span>
                </div>
            </div>

            <div v-if="items.length === 0" class="table-empty rounded-2xl border border-dashed border-border bg-surface-muted">
                No recent notifications.
            </div>
        </div>
    </div>
</template>
