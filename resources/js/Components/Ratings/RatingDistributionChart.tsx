import React from 'react';
import { ReviewStatistics } from '@/Stores/reviewStore';

interface RatingDistributionChartProps {
    statistics: ReviewStatistics;
}

export const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({ statistics }) => {
    const maxCount = Math.max(...Object.values(statistics.distribution), 1); // Avoid division by zero

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rating Distribution</h3>
            
            <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                    // @ts-ignore
                    const count = statistics.distribution[star] || 0;
                    const percentage = (count / maxCount) * 100;
                    
                    return (
                        <div key={star} className="flex items-center text-sm">
                            <span className="w-12 font-medium text-gray-600 dark:text-gray-400">{star} Stars</span>
                            <div className="flex-1 mx-3 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-400' : 'bg-red-500'}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="w-8 text-right text-gray-500 dark:text-gray-500">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
