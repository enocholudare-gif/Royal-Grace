import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { useNotificationStore } from '../../Stores/notificationStore';
import { NotificationCard } from '../../Components/Notifications/NotificationCard';
import { NotificationFilter } from '../../Components/Notifications/NotificationFilter';
import { NotificationEmptyState } from '../../Components/Notifications/NotificationEmptyState';
import { NotificationSkeleton } from '../../Components/Notifications/NotificationSkeleton';
import { CheckCircle, Trash2 } from 'lucide-react';
import AppLayoutShell from '../../Layouts/AppLayoutShell';

export default function NotificationCenter() {
    const { 
        notifications, 
        loading, 
        hasMore, 
        currentPage,
        fetchNotifications, 
        markAllAsRead,
        bulkDelete
    } = useNotificationStore();
    
    const [filter, setFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        fetchNotifications(1, { unread: filter === 'unread' });
        setSelectedIds([]);
    }, [filter, fetchNotifications]);

    const lastNotificationElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchNotifications(currentPage + 1, { unread: filter === 'unread' });
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore, currentPage, fetchNotifications, filter]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(notifications.map(n => n.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (selectedIds.length > 0) {
            bulkDelete(selectedIds);
            setSelectedIds([]);
        }
    };

    return (
        <AppLayoutShell
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Notifications
                    </h2>
                </div>
            }
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <NotificationFilter 
                            currentStatus={filter} 
                            onStatusChange={(status) => setFilter(status)} 
                        />
                        
                        <div className="flex gap-3 w-full sm:w-auto">
                            {selectedIds.length > 0 && (
                                <button 
                                    onClick={handleBulkDelete}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIds.length})
                                </button>
                            )}
                            
                            <button 
                                onClick={() => markAllAsRead()}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
                            >
                                <CheckCircle className="w-4 h-4 text-gray-500" /> Mark all read
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm sm:rounded-xl border border-gray-100 dark:border-gray-800">
                        {notifications.length > 0 && (
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                    checked={selectedIds.length === notifications.length && notifications.length > 0}
                                    onChange={handleSelectAll}
                                />
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Select All</span>
                            </div>
                        )}

                        <div className="flex flex-col">
                            {notifications.length === 0 && !loading ? (
                                <NotificationEmptyState />
                            ) : (
                                notifications.map((notification, index) => {
                                    const isLastElement = notifications.length === index + 1;
                                    return (
                                        <div 
                                            key={notification.id} 
                                            ref={isLastElement ? lastNotificationElementRef : null}
                                            className="flex items-stretch border-b border-gray-100 dark:border-gray-800 group"
                                        >
                                            <div className="px-4 py-4 flex items-start pt-5 bg-white dark:bg-gray-900">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 mt-1 cursor-pointer"
                                                    checked={selectedIds.includes(notification.id)}
                                                    onChange={() => handleSelect(notification.id)}
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <NotificationCard notification={notification} />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            {loading && <NotificationSkeleton />}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayoutShell>
    );
}
