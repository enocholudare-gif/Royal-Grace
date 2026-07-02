import React from 'react';
import { ReviewCard } from './ReviewCard';
import { Review } from '@/Stores/reviewStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewListProps {
    reviews: Review[];
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
    };
    onPageChange: (page: number) => void;
    showClient?: boolean;
    showCaregiver?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({ 
    reviews, 
    pagination, 
    onPageChange,
    showClient = true,
    showCaregiver = true
}) => {
    if (reviews.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map(review => (
                    <ReviewCard 
                        key={review.id} 
                        review={review} 
                        showClient={showClient}
                        showCaregiver={showCaregiver}
                    />
                ))}
            </div>

            {pagination.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-lg mt-6 shadow-sm">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Showing page <span className="font-medium">{pagination.current_page}</span> of <span className="font-medium">{pagination.last_page}</span> 
                                ({pagination.total} total)
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => onPageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => onPageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
