import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

export function useMessaging() {
    const page = usePage();
    const currentUser = computed(() => page.props.auth.user);

    const formatTimestamp = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const getOtherParticipant = (conversation) => {
        if (!conversation || !conversation.participants || !currentUser.value) return null;
        return conversation.participants.find(p => p.user_id !== currentUser.value.id);
    };

    return {
        currentUser,
        formatTimestamp,
        getOtherParticipant
    };
}
