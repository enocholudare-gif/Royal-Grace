import { computed, ref } from 'vue';

const isOpen = ref(false);

export function useNotificationsPanel() {
    const open = () => {
        isOpen.value = true;
    };

    const close = () => {
        isOpen.value = false;
    };

    const toggle = () => {
        isOpen.value = !isOpen.value;
    };

    return {
        isNotificationsPanelOpen: computed(() => isOpen.value),
        openNotificationsPanel: open,
        closeNotificationsPanel: close,
        toggleNotificationsPanel: toggle,
    };
}
