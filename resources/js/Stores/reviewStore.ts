import { create } from 'zustand';
import axios from 'axios';

export interface Review {
    id: number;
    booking_id: number;
    client_id: number;
    caregiver_id: number;
    rating: number;
    comment: string | null;
    submitted_at: string;
    booking?: any;
    client?: {
        id: number;
        user: {
            first_name: string;
            last_name: string;
            avatar_url: string | null;
        }
    };
    caregiver?: {
        id: number;
        user: {
            first_name: string;
            last_name: string;
            avatar_url: string | null;
        }
    };
}

export interface ReviewStatistics {
    total_reviews: number;
    average_rating: number;
    distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

interface ReviewStore {
    reviews: Review[];
    statistics: ReviewStatistics | null;
    currentReview: Review | null;
    loading: boolean;
    statisticsLoading: boolean;
    error: string | null;
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
    };
    
    // Actions
    fetchReviews: (page?: number, filters?: Record<string, any>) => Promise<void>;
    fetchHistory: (page?: number, filters?: Record<string, any>) => Promise<void>;
    fetchStatistics: () => Promise<void>;
    fetchReview: (id: number) => Promise<void>;
    submitReview: (bookingId: number, rating: number, comment?: string) => Promise<void>;
    clearError: () => void;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
    reviews: [],
    statistics: null,
    currentReview: null,
    loading: false,
    statisticsLoading: false,
    error: null,
    pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
    },

    clearError: () => set({ error: null }),

    fetchReviews: async (page = 1, filters = {}) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams({ page: page.toString(), ...filters });
            const response = await axios.get(`/ratings?${params.toString()}`);
            set({ 
                reviews: response.data.data,
                pagination: {
                    current_page: response.data.meta.current_page,
                    last_page: response.data.meta.last_page,
                    total: response.data.meta.total,
                },
                loading: false 
            });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch reviews', loading: false });
        }
    },

    fetchHistory: async (page = 1, filters = {}) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams({ page: page.toString(), ...filters });
            const response = await axios.get(`/ratings/history?${params.toString()}`);
            set({ 
                reviews: response.data.data,
                pagination: {
                    current_page: response.data.meta.current_page,
                    last_page: response.data.meta.last_page,
                    total: response.data.meta.total,
                },
                loading: false 
            });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch review history', loading: false });
        }
    },

    fetchStatistics: async () => {
        set({ statisticsLoading: true, error: null });
        try {
            const response = await axios.get('/ratings/statistics');
            set({ statistics: response.data, statisticsLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch statistics', statisticsLoading: false });
        }
    },

    fetchReview: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/ratings/${id}`);
            set({ currentReview: response.data.data, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch review details', loading: false });
        }
    },

    submitReview: async (bookingId, rating, comment) => {
        set({ loading: true, error: null });
        try {
            await axios.post('/ratings', {
                booking_id: bookingId,
                rating,
                comment
            });
            set({ loading: false });
            // Optionally refetch history or stats
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'Failed to submit review', 
                loading: false 
            });
            throw error;
        }
    }
}));
