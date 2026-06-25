import { ref, computed, watch, onUnmounted } from 'vue';
import { useConversationStore } from '../Stores/conversationStore';
import { useMessageStore } from '../Stores/messageStore';
import { useRealtimeMessaging } from './useRealtimeMessaging';
import { useMessaging } from './useMessaging';

export function useConversation(conversationIdRef) {
    const conversationStore = useConversationStore();
    const messageStore = useMessageStore();
    const { listenToConversationChannel, stopListeningToConversation } = useRealtimeMessaging();
    const { currentUser } = useMessaging();
    
    const typingUsers = ref(new Set());
    let typingTimeouts = {};

    const loadConversationData = async (id) => {
        if (!id) return;
        conversationStore.setActiveConversation(id);
        await messageStore.fetchMessages(id, 1);
        conversationStore.markAsRead(id);
        listenToConversationChannel(id);
    };

    watch(() => conversationIdRef.value, (newId, oldId) => {
        if (oldId) {
            stopListeningToConversation(oldId);
        }
        if (newId) {
            loadConversationData(newId);
        }
    }, { immediate: true });

    onUnmounted(() => {
        if (conversationIdRef.value) {
            stopListeningToConversation(conversationIdRef.value);
        }
    });

    const activeConversation = computed(() => conversationStore.activeConversation);
    const messages = computed(() => messageStore.messages);
    const isLoading = computed(() => messageStore.isLoading);

    const sendMessage = async (content, attachments = []) => {
        if (!content.trim() && attachments.length === 0) return;
        
        await messageStore.sendMessage(conversationIdRef.value, {
            content,
            attachments
        });
        
        // Update local conversation latest message preview
        conversationStore.updateConversation(conversationIdRef.value, {
            latest_message: { content, created_at: new Date().toISOString() }
        });
    };

    const sendTypingEvent = () => {
        if (!window.Echo || !conversationIdRef.value) return;
        window.Echo.private(`conversations.${conversationIdRef.value}`)
            .whisper('typing', {
                user: currentUser.value
            });
    };

    const handleTypingEvent = (e) => {
        if (e.detail.conversationId !== conversationIdRef.value) return;
        const user = e.detail.user;
        
        typingUsers.value.add(user.name);
        
        if (typingTimeouts[user.id]) clearTimeout(typingTimeouts[user.id]);
        
        typingTimeouts[user.id] = setTimeout(() => {
            typingUsers.value.delete(user.name);
        }, 3000);
    };

    window.addEventListener('user-typing', handleTypingEvent);

    onUnmounted(() => {
        window.removeEventListener('user-typing', handleTypingEvent);
    });

    return {
        activeConversation,
        messages,
        isLoading,
        typingUsers,
        sendMessage,
        sendTypingEvent
    };
}
