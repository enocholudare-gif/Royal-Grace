<script>
import AdminLayout from '../../Layouts/AdminLayout.vue';
import CaregiverLayout from '../../Layouts/CaregiverLayout.vue';
import FamilyLayout from '../../Layouts/FamilyLayout.vue';
import ClientLayout from '../../Layouts/ClientLayout.vue';

export default {
    layout: (h, page) => {
        const role = page.props.auth?.user?.role;
        let Layout = ClientLayout;
        if (['admin', 'super-admin'].includes(role)) Layout = AdminLayout;
        else if (role === 'caregiver') Layout = CaregiverLayout;
        else if (role === 'family-member') Layout = FamilyLayout;
        
        return h(Layout, () => h(page));
    }
}
</script>
<script setup>
import { Head } from '@inertiajs/vue3';
import { ref, onMounted, computed, watch, nextTick } from 'vue';

// Composables & Stores
import { useMessaging } from '../../Composables/useMessaging';
import { useConversationStore } from '../../Stores/conversationStore';
import { useConversation } from '../../Composables/useConversation';

// Components
import ConversationCard from '../../Components/Messaging/ConversationCard.vue';
import ChatHeader from '../../Components/Messaging/ChatHeader.vue';
import ChatMessage from '../../Components/Messaging/ChatMessage.vue';
import MessageComposer from '../../Components/Messaging/MessageComposer.vue';
import MessageSearch from '../../Components/Messaging/MessageSearch.vue';
import EmptyChatState from '../../Components/Messaging/EmptyChatState.vue';
import LoadingSkeleton from '../../Components/Messaging/LoadingSkeleton.vue';

const { currentUser } = useMessaging();
const conversationStore = useConversationStore();

// Local State
const isMobileListVisible = ref(true);
const messagesContainer = ref(null);

// Initialize Stores
onMounted(() => {
    conversationStore.fetchConversations();
});

const { 
    activeConversation, 
    messages, 
    isLoading: isMessagesLoading, 
    typingUsers, 
    sendMessage, 
    sendTypingEvent 
} = useConversation(computed(() => conversationStore.activeConversationId));

// Handlers
const selectConversation = (id) => {
    conversationStore.setActiveConversation(id);
    isMobileListVisible.value = false;
    scrollToBottom();
};

const goBackToList = () => {
    conversationStore.setActiveConversation(null);
    isMobileListVisible.value = true;
};

const handleSend = async (content) => {
    await sendMessage(content);
    scrollToBottom();
};

const handleTyping = () => {
    sendTypingEvent();
};

// Auto scroll down when messages change
const scrollToBottom = async () => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

watch(() => messages.value.length, () => {
    scrollToBottom();
});

</script>

<template>
    <Head title="Messages" />

    <div class="flex h-[calc(100vh-6rem)] overflow-hidden rounded-2xl border border-border bg-surface shadow-sm sm:h-[calc(100vh-8rem)]">
        
        <!-- Sidebar (Conversation List) -->
        <div 
            class="flex w-full flex-col border-r border-border bg-surface-subtle transition-all duration-300 md:w-80 lg:w-96"
            :class="[isMobileListVisible ? 'flex' : 'hidden md:flex']"
        >
            <!-- Header -->
            <div class="border-b border-border p-4">
                <h1 class="mb-4 text-xl font-bold text-text">Messages</h1>
                <MessageSearch v-model="conversationStore.searchQuery" />
            </div>

            <!-- List -->
            <div class="flex-1 overflow-y-auto p-2">
                <template v-if="conversationStore.isLoading">
                    <LoadingSkeleton v-for="i in 5" :key="i" />
                </template>
                <template v-else-if="conversationStore.filteredConversations.length > 0">
                    <ConversationCard
                        v-for="conv in conversationStore.filteredConversations"
                        :key="conv.id"
                        :conversation="conv"
                        :is-active="conversationStore.activeConversationId === conv.id"
                        @click="selectConversation(conv.id)"
                    />
                </template>
                <template v-else>
                    <div class="p-8 text-center text-sm text-text-muted">
                        No conversations found.
                    </div>
                </template>
            </div>
        </div>

        <!-- Main Chat Area -->
        <div 
            class="flex flex-1 flex-col bg-surface transition-all duration-300"
            :class="[!isMobileListVisible ? 'flex' : 'hidden md:flex']"
        >
            <template v-if="activeConversation">
                <!-- Chat Header -->
                <ChatHeader 
                    :conversation="activeConversation"
                    :typing-users="typingUsers"
                    @back="goBackToList"
                />

                <!-- Messages Timeline -->
                <div class="flex-1 overflow-y-auto p-4 sm:p-6" ref="messagesContainer">
                    <div v-if="isMessagesLoading" class="flex justify-center p-4">
                        <svg class="h-6 w-6 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    
                    <div v-else class="flex flex-col gap-4">
                        <ChatMessage 
                            v-for="msg in messages" 
                            :key="msg.id || msg.created_at"
                            :message="msg"
                        />
                    </div>
                </div>

                <!-- Composer -->
                <MessageComposer 
                    @send="handleSend"
                    @typing="handleTyping"
                />
            </template>

            <!-- Empty State -->
            <EmptyChatState v-else />
        </div>

    </div>
</template>
