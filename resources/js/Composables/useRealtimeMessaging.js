import { onMounted, onUnmounted } from 'vue';
import { useConversationStore } from '../Stores/conversationStore';
import { useMessageStore } from '../Stores/messageStore';
import { useNotificationStore } from '../Stores/notificationStore';
import { useMessaging } from './useMessaging';

export function useRealtimeMessaging() {
    const conversationStore = useConversationStore();
    const messageStore = useMessageStore();
    const notificationStore = useNotificationStore();
    const { currentUser } = useMessaging();

    const listenToUserChannel = () => {
        if (!window.Echo || !currentUser.value) return;

        window.Echo.private(`users.${currentUser.value.id}`)
            .listen('NewMessageReceived', (e) => {
                const { message, conversation } = e;

                // Update conversation list
                conversationStore.updateConversation(conversation.id, {
                    latest_message: message,
                    unread_count: (conversation.unread_count || 0) + 1
                });

                // If this conversation is currently open, push to message store and mark read
                if (conversationStore.activeConversationId === conversation.id) {
                    messageStore.receiveMessage(message);
                    conversationStore.markAsRead(conversation.id);
                } else {
                    // Show notification
                    notificationStore.addNotification('New Message', `You received a new message from ${message.sender?.name || 'someone'}`, 'info');
                }
            });
    };

    const listenToConversationChannel = (conversationId) => {
        if (!window.Echo) return;

        window.Echo.private(`conversations.${conversationId}`)
            .listenForWhisper('typing', (e) => {
                // We'll handle typing indicators by firing a custom event or updating store state.
                // For simplicity, we can emit a custom window event that the chat window listens to.
                window.dispatchEvent(new CustomEvent('user-typing', { detail: { conversationId, user: e.user } }));
            });
    };

    const stopListeningToConversation = (conversationId) => {
        if (!window.Echo) return;
        window.Echo.leave(`conversations.${conversationId}`);
    };

    onMounted(() => {
        listenToUserChannel();
    });

    onUnmounted(() => {
        if (window.Echo && currentUser.value) {
            window.Echo.leave(`users.${currentUser.value.id}`);
        }
    });

    return {
        listenToConversationChannel,
        stopListeningToConversation
    };
}
