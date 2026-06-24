<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import AppLogo from './AppLogo.vue';

const props = defineProps({
    navigation: {
        type: Array,
        default: () => [],
    },
    roleLabel: {
        type: String,
        default: 'Workspace',
    },
});

const page = usePage();

const currentUrl = computed(() => page.url || '');

const isActive = (item) => {
    if (!item?.href) {
        return false;
    }

    return currentUrl.value === item.href || currentUrl.value.startsWith(`${item.href}/`);
};
</script>

<template>
    <aside class="hidden h-screen w-72 shrink-0 border-r border-border bg-surface xl:flex xl:flex-col">
        <div class="border-b border-border px-6 py-5">
            <AppLogo />
        </div>

        <div class="border-b border-border px-6 py-4">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-text-soft">Active workspace</p>
            <p class="mt-2 text-sm font-semibold text-text">{{ roleLabel }}</p>
        </div>

        <nav class="flex-1 space-y-1 overflow-y-auto px-4 py-5">
            <Link
                v-for="item in navigation"
                :key="item.label"
                :href="item.href || '#'"
                class="panel-nav-link"
                :class="{ 'panel-nav-link-active': isActive(item) }"
            >
                <span
                    class="flex h-9 w-9 items-center justify-center rounded-xl"
                    :class="isActive(item) ? 'bg-brand-600 text-white' : 'bg-secondary-50 text-text-soft'"
                    aria-hidden="true"
                >
                    <component :is="item.icon" class="h-5 w-5" />
                </span>
                <span class="flex-1">{{ item.label }}</span>
                <span
                    v-if="item.badge"
                    class="badge"
                    :class="isActive(item) ? 'badge-primary' : 'badge-secondary'"
                >
                    {{ item.badge }}
                </span>
            </Link>
        </nav>
    </aside>
</template>
