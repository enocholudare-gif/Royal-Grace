import { create } from 'zustand';
import axios from 'axios';

export interface Notification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: any;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;

    fetchNotifications: (page?: number, filters?: Record<string, any>) => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    bulkDelete: (ids: string[]) => Promise<void>;
    addRealtimeNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 1,

    fetchNotifications: async (page = 1, filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/api/notifications', {
                params: { page, ...filters }
            });
            
            const newNotifications = response.data.data;
            const meta = response.data.meta;

            set((state) => ({
                notifications: page === 1 ? newNotifications : [...state.notifications, ...newNotifications],
                hasMore: meta ? meta.current_page < meta.last_page : newNotifications.length > 0,
                currentPage: page,
                loading: false
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const response = await axios.get('/api/notifications/unread-count');
            set({ unreadCount: response.data.unread_count });
        } catch (error) {
            console.error('Failed to fetch unread count', error);
        }
    },

    markAsRead: async (id: string) => {
        try {
            await axios.patch('/api/notifications/read', { notification_id: id });
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, read_at: new Date().toISOString() } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    },

    markAllAsRead: async () => {
        try {
            await axios.patch('/api/notifications/read-all');
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read_at: new Date().toISOString() })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    },

    deleteNotification: async (id: string) => {
        try {
            await axios.delete(`/api/notifications/${id}`);
            const notification = get().notifications.find((n) => n.id === id);
            
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: !notification?.read_at ? Math.max(0, state.unreadCount - 1) : state.unreadCount
            }));
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    },

    bulkDelete: async (ids: string[]) => {
        try {
            await axios.delete('/api/notifications/bulk', { data: { notification_ids: ids } });
            set((state) => {
                const deletedUnread = state.notifications.filter((n) => ids.includes(n.id) && !n.read_at).length;
                return {
                    notifications: state.notifications.filter((n) => !ids.includes(n.id)),
                    unreadCount: Math.max(0, state.unreadCount - deletedUnread)
                };
            });
        } catch (error) {
            console.error('Failed to bulk delete', error);
        }
    },

    addRealtimeNotification: (notification: Notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    }
}));
