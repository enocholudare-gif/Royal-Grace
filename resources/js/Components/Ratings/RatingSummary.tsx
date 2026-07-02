import React from 'react';
import { RatingStars } from './RatingStars';
import { ReviewStatistics } from '@/Stores/reviewStore';

interface RatingSummaryProps {
    statistics: ReviewStatistics;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({ statistics }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Overall Rating</h3>
            
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
                {statistics.average_rating.toFixed(1)}
            </div>
            
            <RatingStars rating={Math.round(statistics.average_rating)} size={24} className="mb-2" />
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on {statistics.total_reviews} review{statistics.total_reviews !== 1 && 's'}
            </p>
        </div>
    );
};
