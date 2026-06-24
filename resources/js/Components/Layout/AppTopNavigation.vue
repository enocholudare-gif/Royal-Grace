<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';

const props = defineProps({
    title: {
        type: String,
        default: 'Dashboard',
    },
    description: {
        type: String,
        default: '',
    },
    user: {
        type: Object,
        default: () => ({}),
    },
    unreadCount: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['toggle-mobile-menu', 'toggle-notifications']);

const initials = computed(() => {
    const name = props.user?.name?.trim();

    if (!name) {
        return 'RG';
    }

    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
});

const page = usePage();
const canLogout = computed(() => Boolean(page.props?.auth?.user));
</script>

<template>
    <header class="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
        <div class="container-page flex min-h-20 items-center justify-between gap-4 py-4">
            <div class="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    class="btn-secondary btn-sm xl:hidden"
                    @click="emit('toggle-mobile-menu')"
                >
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
                    </svg>
                </button>

                <div class="min-w-0">
                    <h1 class="truncate text-xl font-semibold md:text-2xl">{{ title }}</h1>
                    <p v-if="description" class="truncate text-sm text-text-muted">
                        {{ description }}
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <button
                    type="button"
                    class="btn-secondary btn-sm relative"
                    @click="emit('toggle-notifications')"
                >
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.17V11a6 6 0 1 0-12 0v3.17a2 2 0 0 1-.6 1.42L4 17h5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10 17a2 2 0 0 0 4 0" stroke-linecap="round" />
                    </svg>
                    <span v-if="unreadCount > 0" class="absolute -right-1.5 -top-1.5 badge-danger min-w-5 justify-center px-1.5 py-0.5">
                        {{ unreadCount > 99 ? '99+' : unreadCount }}
                    </span>
                </button>

                <div class="hidden items-center gap-3 rounded-xl border border-border bg-surface-subtle px-3 py-2 md:flex">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
                        {{ initials }}
                    </div>

                    <div class="min-w-0">
                        <p class="truncate text-sm font-semibold text-text">{{ user?.name || 'Royal Grace User' }}</p>
                        <p class="truncate text-xs text-text-soft">{{ user?.email || 'care@royalgrace.local' }}</p>
                    </div>
                </div>

                <Link
                    v-if="canLogout"
                    href="/logout"
                    method="post"
                    as="button"
                    class="btn-primary btn-sm hidden md:inline-flex"
                >
                    Logout
                </Link>
            </div>
        </div>
    </header>
</template>
