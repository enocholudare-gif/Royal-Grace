import React from 'react';
import { Filter } from 'lucide-react';

interface ReviewFilterProps {
    filters: {
        rating?: string;
        date_from?: string;
        date_to?: string;
        [key: string]: any;
    };
    onChange: (filters: Record<string, any>) => void;
    showAdminFilters?: boolean;
}

export const ReviewFilter: React.FC<ReviewFilterProps> = ({ filters, onChange, showAdminFilters = false }) => {
    
    const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ ...filters, rating: e.target.value });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-4">
            <div className="flex items-center text-gray-500 dark:text-gray-400 font-medium">
                <Filter size={18} className="mr-2" />
                Filters
            </div>
            
            <div>
                <select
                    value={filters.rating || ''}
                    onChange={handleRatingChange}
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>

            {showAdminFilters && (
                <>
                    {/* Placeholder for future admin specific filters like client_id, caregiver_id */}
                </>
            )}

            {Object.values(filters).some(v => !!v) && (
                <button
                    onClick={() => onChange({})}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
};
