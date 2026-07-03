import { create } from 'zustand';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    role?: { slug: string; name?: string } | string;
    role_slug?: string;
    avatar_url?: string;
}

export interface Attachment {
    id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
}

export interface TicketMessage {
    id: number;
    support_ticket_id: number;
    user_id: number;
    message: string;
    is_admin_reply: boolean;
    created_at: string;
    user?: User;
    attachments?: Attachment[];
}

export interface Ticket {
    id: number;
    ticket_number: string;
    subject: string;
    category: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'emergency';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    user_id: number;
    assigned_to?: number;
    resolved_at?: string;
    created_at: string;
    updated_at: string;
    messages_count?: number;
    user?: User;
    assignee?: User;
    messages?: TicketMessage[];
    attachments?: Attachment[];
}

export interface Faq {
    id: number;
    category: string;
    question: string;
    answer: string;
}

interface SupportState {
    tickets: Ticket[];
    currentTicket: Ticket | null;
    faqs: Faq[];
    loading: boolean;
    ticketLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;

    fetchTickets: (page?: number, filters?: Record<string, string>) => Promise<void>;
    fetchTicketDetails: (id: number) => Promise<void>;
    createTicket: (data: FormData) => Promise<Ticket | null>;
    replyToTicket: (id: number, data: FormData) => Promise<void>;
    updateTicketStatus: (id: number, data: { status: string; priority?: string; assigned_to?: number }) => Promise<void>;
    fetchFaqs: () => Promise<void>;
}

export const useSupportStore = create<SupportState>((set, get) => ({
    tickets: [],
    currentTicket: null,
    faqs: [],
    loading: false,
    ticketLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    hasMore: false,

    fetchTickets: async (page = 1, filters = {}) => {
        set({ loading: true, error: null });
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...filters
            }).toString();

            const response = await window.axios.get(`/support?${queryParams}`);
            
            const newTickets = response.data.data;
            set((state) => ({
                tickets: page === 1 ? newTickets : [...state.tickets, ...newTickets],
                currentPage: response.data.current_page,
                totalPages: response.data.last_page,
                hasMore: response.data.current_page < response.data.last_page,
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch tickets', loading: false });
        }
    },

    fetchTicketDetails: async (id: number) => {
        set({ ticketLoading: true, error: null });
        try {
            const response = await window.axios.get(`/support/${id}`);
            const ticket = response.data?.data ?? response.data;
            set({ currentTicket: ticket, ticketLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch ticket details', ticketLoading: false });
        }
    },

    createTicket: async (data: FormData) => {
        set({ loading: true, error: null });
        try {
            const response = await window.axios.post('/support', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newTicket = response.data.ticket;
            set((state) => ({
                tickets: [newTicket, ...state.tickets],
                loading: false
            }));
            return newTicket;
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create ticket', loading: false });
            return null;
        }
    },

    replyToTicket: async (id: number, data: FormData) => {
        set({ loading: true, error: null });
        try {
            const response = await window.axios.post(`/support/${id}/reply`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const newMessage = response.data.data;
            
            set((state) => {
                if (!state.currentTicket || state.currentTicket.id !== id) return state;
                
                return {
                    loading: false,
                    currentTicket: {
                        ...state.currentTicket,
                        messages: [...(state.currentTicket.messages || []), newMessage]
                    }
                };
            });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to send reply', loading: false });
        }
    },

    updateTicketStatus: async (id: number, data: { status: string; priority?: string; assigned_to?: number }) => {
        set({ loading: true, error: null });
        try {
            const response = await window.axios.put(`/support/${id}`, data);
            const updatedTicket = response.data.ticket;

            set((state) => ({
                loading: false,
                currentTicket: state.currentTicket?.id === id 
                    ? { ...state.currentTicket, ...updatedTicket }
                    : state.currentTicket,
                tickets: state.tickets.map(t => t.id === id ? { ...t, ...updatedTicket } : t)
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update ticket', loading: false });
        }
    },

    fetchFaqs: async () => {
        set({ loading: true, error: null });
        try {
            const response = await window.axios.get('/support/faq');
            set({ faqs: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch FAQs', loading: false });
        }
    }
}));
