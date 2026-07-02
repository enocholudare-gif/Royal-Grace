import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useReviewStore } from '@/Stores/reviewStore';
import { ReviewList } from '@/Components/Ratings/ReviewList';
import { ReviewFilter } from '@/Components/Ratings/ReviewFilter';
import { ReviewEmptyState } from '@/Components/Ratings/ReviewEmptyState';
import { ReviewSkeleton } from '@/Components/Ratings/ReviewSkeleton';
import { AlertCircle } from 'lucide-react';

export default function History() {
    const { reviews, pagination, loading, error, fetchHistory } = useReviewStore();
    const [filters, setFilters] = useState<Record<string, any>>({});

    useEffect(() => {
        fetchHistory(1, filters);
    }, [filters]);

    const handlePageChange = (page: number) => {
        fetchHistory(page, filters);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <ClientLayout>
            <Head title="My Reviews" />
            
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Reviews</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            View the feedback you've submitted for past visits.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
                        <AlertCircle className="text-red-500 mr-3 shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}

                <div className="mb-6">
                    <ReviewFilter filters={filters} onChange={setFilters} />
                </div>

                {loading && reviews.length === 0 ? (
                    <ReviewSkeleton />
                ) : reviews.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <ReviewList 
                            reviews={reviews} 
                            pagination={pagination} 
                            onPageChange={handlePageChange} 
                            showClient={false} // Hidden since they are the client
                        />
                    </div>
                ) : (
                    <ReviewEmptyState 
                        title="No reviews found" 
                        description={Object.keys(filters).length > 0 ? "Try clearing your filters." : "You haven't submitted any reviews yet."} 
                    />
                )}
            </div>
        </ClientLayout>
    );
}
