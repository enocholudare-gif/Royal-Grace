import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Calendar, CheckCircle, XCircle, CreditCard, MessageSquare, Info } from 'lucide-react';
import { Notification, useNotificationStore } from '../../Stores/notificationStore';
import { Link } from '@inertiajs/react';

interface NotificationCardProps {
    notification: Notification;
    onClick?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClick }) => {
    const markAsRead = useNotificationStore((state) => state.markAsRead);
    const deleteNotification = useNotificationStore((state) => state.deleteNotification);
    
    const isUnread = !notification.read_at;

    const getIcon = () => {
        const typeName = notification.type.split('\\').pop() || '';
        switch (typeName) {
            case 'BookingCreatedNotification':
            case 'BookingAssignedNotification':
                return <Calendar className="w-5 h-5 text-blue-500" />;
            case 'BookingCancelledNotification':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'PaymentSuccessfulNotification':
                return <CreditCard className="w-5 h-5 text-green-500" />;
            case 'VisitStartedNotification':
            case 'VisitCompletedNotification':
            case 'VisitReportSubmittedNotification':
                return <CheckCircle className="w-5 h-5 text-indigo-500" />;
            case 'NewMessageNotification':
                return <MessageSquare className="w-5 h-5 text-purple-500" />;
            default:
                return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    const handleRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isUnread) markAsRead(notification.id);
    };

    return (
        <div 
            onClick={onClick}
            className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex gap-4 ${isUnread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
        >
            <div className="flex-shrink-0 mt-1">
                {getIcon()}
            </div>
            
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-medium ${isUnread ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.data.title || 'Notification'}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notification.data.message || notification.data.description}
                </p>

                <div className="mt-2 flex gap-3 items-center">
                    {notification.data.url && (
                        <Link 
                            href={notification.data.url} 
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                            Open Related Record
                        </Link>
                    )}
                    
                    {isUnread && (
                        <button 
                            onClick={handleRead}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                        >
                            Mark as read
                        </button>
                    )}
                </div>
            </div>

            {isUnread && (
                <div className="flex-shrink-0 flex items-center justify-center w-2 h-2 mt-2 bg-blue-500 rounded-full" />
            )}
        </div>
    );
};
