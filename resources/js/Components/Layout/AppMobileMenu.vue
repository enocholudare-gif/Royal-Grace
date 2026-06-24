<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import AppLogo from './AppLogo.vue';

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    navigation: {
        type: Array,
        default: () => [],
    },
    roleLabel: {
        type: String,
        default: 'Workspace',
    },
});

const emit = defineEmits(['close']);

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
    <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="open" class="fixed inset-0 z-50 xl:hidden">
            <div class="absolute inset-0 bg-overlay" @click="emit('close')" />

            <div class="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-surface shadow-lg">
                <div class="flex items-center justify-between border-b border-border px-5 py-5">
                    <AppLogo />

                    <button type="button" class="btn-secondary btn-sm" @click="emit('close')">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="m6 6 12 12M18 6 6 18" stroke-linecap="round" />
                        </svg>
                    </button>
                </div>

                <div class="border-b border-border px-5 py-4">
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
                        @click="emit('close')"
                    >
                        <span
                            class="flex h-9 w-9 items-center justify-center rounded-xl"
                            :class="isActive(item) ? 'bg-brand-600 text-white' : 'bg-secondary-50 text-text-soft'"
                        >
                            <component :is="item.icon" class="h-5 w-5" />
                        </span>
                        <span class="flex-1">{{ item.label }}</span>
                        <span v-if="item.badge" class="badge badge-secondary">{{ item.badge }}</span>
                    </Link>
                </nav>
            </div>
        </div>
    </transition>
</template>
