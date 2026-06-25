<script setup>
import { computed } from 'vue';
import { useMessaging } from '../../Composables/useMessaging';
import OnlineStatus from './OnlineStatus.vue';
import TypingIndicator from './TypingIndicator.vue';

const props = defineProps({
    conversation: { type: Object, required: true },
    typingUsers: { type: Set, default: () => new Set() }
});

const emit = defineEmits(['back', 'search']);

const { getOtherParticipant } = useMessaging();
const otherParticipant = computed(() => getOtherParticipant(props.conversation));

const isTyping = computed(() => props.typingUsers.size > 0);
</script>

<template>
    <div class="flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div class="flex items-center gap-4">
            <button
                type="button"
                class="rounded-full p-2 text-text-muted transition hover:bg-surface-subtle hover:text-text lg:hidden"
                @click="$emit('back')"
            >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div class="relative h-10 w-10 shrink-0">
                <div class="flex h-full w-full items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold uppercase">
                    {{ otherParticipant?.user?.name?.charAt(0) || '?' }}
                </div>
                <OnlineStatus :user="otherParticipant?.user" class="absolute bottom-0 right-0" />
            </div>

            <div>
                <h2 class="text-sm font-semibold text-text sm:text-base">
                    {{ otherParticipant?.user?.name || props.conversation.title || 'Conversation' }}
                </h2>
                <div class="flex items-center gap-2 text-xs text-text-soft">
                    <span v-if="!isTyping">
                        {{ otherParticipant?.role?.name || 'User' }}
                    </span>
                    <TypingIndicator v-else />
                </div>
            </div>
        </div>

        <div class="flex items-center gap-2">
            <button
                type="button"
                class="rounded-full p-2 text-text-muted transition hover:bg-surface-subtle hover:text-text"
                @click="$emit('search')"
            >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    </div>
</template>
