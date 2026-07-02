import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { RatingStars } from '@/Components/Ratings/RatingStars';
import { useReviewStore } from '@/Stores/reviewStore';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
    booking: any;
}

export default function Submit({ booking }: Props) {
    const { submitReview, loading, error, clearError } = useReviewStore();
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        clearError();

        if (rating === 0) {
            setLocalError('Please select a rating.');
            return;
        }

        try {
            await submitReview(booking.id, rating, comment);
            // On success, redirect to history
            router.get('/client/ratings');
        } catch (err: any) {
            // Error is handled by store, but we catch to prevent redirect
            console.error('Failed to submit review', err);
        }
    };

    return (
        <ClientLayout>
            <Head title="Submit Review" />
            
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Your Visit</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Please share your feedback regarding the visit on {format(new Date(booking.scheduled_start_at), 'MMMM do, yyyy')}.
                    </p>
                </div>

                {(error || localError) && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
                        <AlertCircle className="text-red-500 mr-3 shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-red-800 dark:text-red-200">{error || localError}</p>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Visit Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Service</span>
                                <span className="font-medium text-gray-900 dark:text-white">{booking.service?.name}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Caregiver</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {booking.assigned_caregiver ? `${booking.assigned_caregiver.user.first_name} ${booking.assigned_caregiver.user.last_name}` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                How would you rate this visit? <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                <RatingStars 
                                    rating={rating} 
                                    interactive={true} 
                                    onRatingChange={setRating} 
                                    size={40} 
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Additional Comments (Optional)
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
                                    <MessageSquare size={20} />
                                </div>
                                <textarea
                                    id="comment"
                                    rows={4}
                                    className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    placeholder="Tell us what went well or what could be improved..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || rating === 0}
                                className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ClientLayout>
    );
}
