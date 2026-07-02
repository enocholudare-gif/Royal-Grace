import React from 'react';

export function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col gap-2 w-full max-w-md">
                            <div className="flex gap-2">
                                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
