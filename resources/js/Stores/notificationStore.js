import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([]);

    const addNotification = (title, message, type = 'info') => {
        const id = Date.now();
        notifications.value.push({ id, title, message, type });
        setTimeout(() => removeNotification(id), 5000);
    };

    const removeNotification = (id) => {
        notifications.value = notifications.value.filter(n => n.id !== id);
    };

    return {
        notifications,
        addNotification,
        removeNotification,
    };
});
