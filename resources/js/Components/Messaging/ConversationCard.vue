<script setup>
import { computed } from 'vue';
import { useMessaging } from '../../Composables/useMessaging';
import OnlineStatus from './OnlineStatus.vue';

const props = defineProps({
    conversation: { type: Object, required: true },
    isActive: { type: Boolean, default: false }
});

const { getOtherParticipant, formatTimestamp } = useMessaging();
const otherParticipant = computed(() => getOtherParticipant(props.conversation));
</script>

<template>
    <div
        class="group relative flex cursor-pointer items-center gap-3 rounded-xl p-3 transition hover:bg-surface-subtle"
        :class="{ 'bg-surface-subtle': isActive }"
    >
        <!-- Avatar -->
        <div class="relative h-12 w-12 shrink-0">
            <div class="flex h-full w-full items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold uppercase">
                {{ otherParticipant?.user?.name?.charAt(0) || '?' }}
            </div>
            <OnlineStatus :user="otherParticipant?.user" class="absolute bottom-0 right-0" />
        </div>

        <!-- Details -->
        <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between">
                <h3 class="truncate text-sm font-semibold text-text">
                    {{ otherParticipant?.user?.name || props.conversation.title || 'Unknown' }}
                </h3>
                <span class="shrink-0 text-xs text-text-muted">
                    {{ formatTimestamp(props.conversation.updated_at) }}
                </span>
            </div>
            <div class="mt-1 flex items-center justify-between">
                <p class="truncate text-sm text-text-soft" :class="{ 'font-semibold text-text': conversation.unread_count > 0 }">
                    {{ conversation.latest_message?.content || 'Started a conversation' }}
                </p>
                <!-- Unread Badge -->
                <span
                    v-if="conversation.unread_count > 0"
                    class="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1.5 text-[10px] font-bold text-white shadow-sm"
                >
                    {{ conversation.unread_count > 99 ? '99+' : conversation.unread_count }}
                </span>
            </div>
        </div>
    </div>
</template>
