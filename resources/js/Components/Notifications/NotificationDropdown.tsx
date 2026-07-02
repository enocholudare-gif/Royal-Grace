import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, Trash2, Settings } from 'lucide-react';
import { useNotificationStore } from '../../Stores/notificationStore';
import { NotificationCard } from './NotificationCard';
import { Link, usePage } from '@inertiajs/react';

export const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const { 
        notifications, 
        unreadCount, 
        fetchNotifications, 
        fetchUnreadCount, 
        markAllAsRead,
        addRealtimeNotification
    } = useNotificationStore();

    const { props: pageProps } = usePage();
    const user = pageProps?.auth?.user;

    useEffect(() => {
        fetchUnreadCount();
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // Real-time Echo Listener
        if (user && window.Echo) {
            window.Echo.private(`App.Models.User.${user.id}`)
                .notification((notification: any) => {
                    addRealtimeNotification({
                        id: notification.id,
                        type: notification.type,
                        notifiable_type: 'App\\Models\\User',
                        notifiable_id: user.id,
                        data: notification,
                        read_at: null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                });
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (user && window.Echo) {
                window.Echo.leave(`App.Models.User.${user.id}`);
            }
        };
    }, [fetchUnreadCount, user, addRealtimeNotification]);

    useEffect(() => {
        if (isOpen && notifications.length === 0) {
            fetchNotifications(1);
        }
    }, [isOpen, notifications.length, fetchNotifications]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={() => markAllAsRead()}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        <Check className="w-3 h-3" /> Mark all read
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    <p>You're all caught up!</p>
                                </div>
                            ) : (
                                notifications.slice(0, 10).map((notification) => (
                                    <NotificationCard 
                                        key={notification.id} 
                                        notification={notification} 
                                        onClick={() => {
                                            if (!notification.read_at) {
                                                useNotificationStore.getState().markAsRead(notification.id);
                                            }
                                        }}
                                    />
                                ))
                            )}
                        </div>

                        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-center">
                            <Link 
                                href="/notifications" 
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                onClick={() => setIsOpen(false)}
                            >
                                View all notifications
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
