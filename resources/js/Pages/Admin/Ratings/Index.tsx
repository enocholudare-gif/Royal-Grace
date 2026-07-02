import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useReviewStore } from '@/Stores/reviewStore';
import { ReviewList } from '@/Components/Ratings/ReviewList';
import { ReviewFilter } from '@/Components/Ratings/ReviewFilter';
import { ReviewEmptyState } from '@/Components/Ratings/ReviewEmptyState';
import { ReviewSkeleton } from '@/Components/Ratings/ReviewSkeleton';
import { RatingSummary } from '@/Components/Ratings/RatingSummary';
import { RatingDistributionChart } from '@/Components/Ratings/RatingDistributionChart';
import { AlertCircle } from 'lucide-react';

export default function AdminRatingsIndex() {
    const { 
        reviews, 
        statistics, 
        pagination, 
        loading, 
        statisticsLoading, 
        error, 
        fetchReviews, 
        fetchStatistics 
    } = useReviewStore();
    
    const [filters, setFilters] = useState<Record<string, any>>({});

    useEffect(() => {
        fetchStatistics();
    }, []);

    useEffect(() => {
        fetchReviews(1, filters);
    }, [filters]);

    const handlePageChange = (page: number) => {
        fetchReviews(page, filters);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AdminLayout>
            <Head title="Review Management" />
            
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Monitor and manage client feedback across all services.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
                        <AlertCircle className="text-red-500 mr-3 shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-1">
                        {statisticsLoading ? (
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full animate-pulse">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
                                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
                            </div>
                        ) : statistics ? (
                            <RatingSummary statistics={statistics} />
                        ) : null}
                    </div>
                    <div className="lg:col-span-2">
                        {statisticsLoading ? (
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full animate-pulse">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    ))}
                                </div>
                            </div>
                        ) : statistics ? (
                            <RatingDistributionChart statistics={statistics} />
                        ) : null}
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <ReviewFilter filters={filters} onChange={setFilters} showAdminFilters={true} />
                </div>

                {/* Review List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Reviews</h2>
                    </div>

                    {loading && reviews.length === 0 ? (
                        <ReviewSkeleton />
                    ) : reviews.length > 0 ? (
                        <ReviewList 
                            reviews={reviews} 
                            pagination={pagination} 
                            onPageChange={handlePageChange} 
                        />
                    ) : (
                        <ReviewEmptyState 
                            title="No reviews found" 
                            description={Object.keys(filters).length > 0 ? "Try adjusting your filters." : "No reviews have been submitted yet."} 
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
