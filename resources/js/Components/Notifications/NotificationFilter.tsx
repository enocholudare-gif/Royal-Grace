import React from 'react';
import { Filter } from 'lucide-react';

interface NotificationFilterProps {
    currentStatus: string;
    onStatusChange: (status: string) => void;
}

export const NotificationFilter: React.FC<NotificationFilterProps> = ({ currentStatus, onStatusChange }) => {
    return (
        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 px-2 text-gray-500">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter:</span>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1">
                {['all', 'unread'].map((status) => (
                    <button
                        key={status}
                        onClick={() => onStatusChange(status)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                            currentStatus === status
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
};
