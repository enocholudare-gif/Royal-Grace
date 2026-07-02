import React from 'react';
import { StarOff } from 'lucide-react';

interface ReviewEmptyStateProps {
    title?: string;
    description?: string;
}

export const ReviewEmptyState: React.FC<ReviewEmptyStateProps> = ({ 
    title = "No reviews found", 
    description = "There are currently no reviews matching your criteria." 
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
                <StarOff size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>
        </div>
    );
};
