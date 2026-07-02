import React from 'react';
import { RatingStars } from './RatingStars';
import { Review } from '@/Stores/reviewStore';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

interface ReviewCardProps {
    review: Review;
    showClient?: boolean;
    showCaregiver?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, showClient = true, showCaregiver = true }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <RatingStars rating={review.rating} size={18} />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                        {formatDistanceToNow(new Date(review.submitted_at), { addSuffix: true })}
                    </span>
                </div>
                {review.rating < 3 && (
                    <div className="flex items-center text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md text-xs font-medium">
                        <AlertTriangle size={14} className="mr-1" />
                        Needs Attention
                    </div>
                )}
            </div>

            {review.comment ? (
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                    "{review.comment}"
                </p>
            ) : (
                <p className="text-gray-400 dark:text-gray-500 text-sm italic mb-4">
                    No comment provided.
                </p>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4 text-xs text-gray-600 dark:text-gray-400">
                {showClient && review.client && (
                    <div className="flex items-center">
                        <span className="font-semibold mr-1">By:</span>
                        {review.client.user?.first_name} {review.client.user?.last_name}
                    </div>
                )}
                {showCaregiver && review.caregiver && (
                    <div className="flex items-center">
                        <span className="font-semibold mr-1">Caregiver:</span>
                        {review.caregiver.user?.first_name} {review.caregiver.user?.last_name}
                    </div>
                )}
            </div>
        </div>
    );
};
