import React from 'react';

export const NotificationSkeleton: React.FC = () => {
    return (
        <div className="w-full">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-800 flex gap-4 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex-shrink-0" />
                    <div className="flex-grow space-y-3">
                        <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16" />
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
};
