import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMessageStore = defineStore('message', () => {
    const messages = ref([]);
    const isLoading = ref(false);
    const isSending = ref(false);
    const error = ref(null);
    const meta = ref(null);

    const fetchMessages = async (conversationId, page = 1) => {
        if (page === 1) {
            isLoading.value = true;
            messages.value = [];
        }
        error.value = null;
        try {
            const { data } = await window.axios.get(`/api/messages/conversations/${conversationId}/messages`, { params: { page } });
            // Messages typically come back newest first. We reverse them for rendering bottom-up.
            const newMessages = data.data.reverse();
            if (page === 1) {
                messages.value = newMessages;
            } else {
                messages.value.unshift(...newMessages);
            }
            meta.value = data.meta;
        } catch (err) {
            error.value = 'Failed to load messages';
        } finally {
            isLoading.value = false;
        }
    };

    const sendMessage = async (conversationId, payload) => {
        isSending.value = true;
        error.value = null;
        try {
            // Optimistic update
            const tempId = Date.now();
            const optimisticMsg = {
                id: tempId,
                content: payload.content,
                created_at: new Date().toISOString(),
                sender_id: null, // Will be filled properly on refresh or handled in UI
                status: 'sending'
            };
            messages.value.push(optimisticMsg);

            const { data } = await window.axios.post(`/api/messages/conversations/${conversationId}/messages`, payload);
            
            // Replace optimistic message
            const idx = messages.value.findIndex(m => m.id === tempId);
            if (idx !== -1) {
                messages.value[idx] = data.data;
            } else {
                messages.value.push(data.data);
            }
            return data.data;
        } catch (err) {
            error.value = 'Failed to send message';
            throw err;
        } finally {
            isSending.value = false;
        }
    };

    const receiveMessage = (message) => {
        // Prevent duplicate appending
        if (!messages.value.find(m => m.id === message.id)) {
            messages.value.push(message);
        }
    };

    return {
        messages,
        isLoading,
        isSending,
        error,
        meta,
        fetchMessages,
        sendMessage,
        receiveMessage,
    };
});
