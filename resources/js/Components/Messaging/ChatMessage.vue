<script setup>
import { computed } from 'vue';
import { useMessaging } from '../../Composables/useMessaging';
import ChatBubble from './ChatBubble.vue';
import AttachmentPreview from './AttachmentPreview.vue';

const props = defineProps({
    message: { type: Object, required: true }
});

const { currentUser, formatTimestamp } = useMessaging();

const isMine = computed(() => {
    // If sender_id is null, it's a locally optimistic message
    if (!props.message.sender_id) return true;
    return props.message.sender_id === currentUser.value?.id;
});

const time = computed(() => formatTimestamp(props.message.created_at));
</script>

<template>
    <div class="flex w-full" :class="isMine ? 'justify-end' : 'justify-start'">
        <div class="flex max-w-full flex-col" :class="isMine ? 'items-end' : 'items-start'">
            
            <ChatBubble :is-mine="isMine" :status="message.status || (message.read_receipts?.length ? 'read' : 'sent')">
                <p class="whitespace-pre-wrap text-[15px] leading-relaxed" :class="isMine ? 'pr-3' : ''">{{ message.content }}</p>
                
                <div v-if="message.attachments?.length > 0" class="mt-2 flex flex-col gap-2">
                    <AttachmentPreview 
                        v-for="attachment in message.attachments" 
                        :key="attachment.id" 
                        :attachment="attachment" 
                    />
                </div>
            </ChatBubble>
            
            <span class="mt-1 px-1 text-[11px] text-text-muted">
                {{ time }}
            </span>
            
        </div>
    </div>
</template>
