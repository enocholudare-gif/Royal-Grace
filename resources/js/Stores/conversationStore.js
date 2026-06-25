import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useConversationStore = defineStore('conversation', () => {
    const conversations = ref([]);
    const activeConversationId = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const meta = ref(null);
    const searchQuery = ref('');

    const activeConversation = computed(() =>
        conversations.value.find(c => c.id === activeConversationId.value)
    );

    const filteredConversations = computed(() => {
        if (!searchQuery.value) return conversations.value;
        const lowerQ = searchQuery.value.toLowerCase();
        return conversations.value.filter(c => {
            const title = c.title || c.latest_message?.content || 'Conversation';
            return title.toLowerCase().includes(lowerQ);
        });
    });

    const totalUnreadCount = computed(() =>
        conversations.value.reduce((total, conv) => total + (conv.unread_count || 0), 0)
    );

    const fetchConversations = async (page = 1) => {
        if (page === 1) isLoading.value = true;
        error.value = null;
        try {
            const { data } = await window.axios.get('/api/messages/conversations', { params: { page } });
            if (page === 1) {
                conversations.value = data.data;
            } else {
                conversations.value.push(...data.data);
            }
            meta.value = data.meta;
        } catch (err) {
            error.value = 'Failed to load conversations';
        } finally {
            isLoading.value = false;
        }
    };

    const setActiveConversation = (id) => {
        activeConversationId.value = id;
    };

    const updateConversation = (id, updates) => {
        const idx = conversations.value.findIndex(c => c.id === id);
        if (idx !== -1) {
            conversations.value[idx] = { ...conversations.value[idx], ...updates };
        }
    };

    const markAsRead = async (id) => {
        try {
            await window.axios.patch(`/api/messages/conversations/${id}/read`);
            updateConversation(id, { unread_count: 0 });
        } catch (err) {
            console.error('Failed to mark read', err);
        }
    };

    return {
        conversations,
        activeConversationId,
        isLoading,
        error,
        meta,
        searchQuery,
        activeConversation,
        filteredConversations,
        totalUnreadCount,
        fetchConversations,
        setActiveConversation,
        updateConversation,
        markAsRead,
    };
});
