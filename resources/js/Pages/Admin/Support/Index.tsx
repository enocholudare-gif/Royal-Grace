import React, { useEffect, useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useSupportStore, Ticket, TicketMessage } from '../../../Stores/supportStore';
import {
    MessageSquare, Send, Paperclip, X, FileIcon, Download,
    AlertCircle, Clock, Search, ChevronRight, User, Shield,
    RefreshCw, CheckCircle, Circle, ArrowUpCircle, Zap, Filter,
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, { label: string; color: string }> = {
    admin:           { label: 'Admin',        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    'super-admin':   { label: 'Super Admin',  color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    client:          { label: 'Client',       color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    caregiver:       { label: 'Caregiver',    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    'family-member': { label: 'Family',       color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    open:        { label: 'Open',        icon: <Circle className="w-3 h-3" />,          color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300' },
    in_progress: { label: 'In Progress', icon: <ArrowUpCircle className="w-3 h-3" />,   color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300' },
    resolved:    { label: 'Resolved',    icon: <CheckCircle className="w-3 h-3" />,     color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300' },
    closed:      { label: 'Closed',      icon: <AlertCircle className="w-3 h-3" />,     color: 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
    low:       { label: 'Low',       color: 'text-gray-500 bg-gray-100 dark:bg-gray-700' },
    medium:    { label: 'Medium',    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300' },
    high:      { label: 'High',      color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300' },
    emergency: { label: 'Emergency', color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 animate-pulse' },
};

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Ticket List Item ────────────────────────────────────────────────────────

function TicketListItem({ ticket, isSelected, onClick }: {
    ticket: Ticket; isSelected: boolean; onClick: () => void;
}) {
    const status  = STATUS_CONFIG[ticket.status]  ?? STATUS_CONFIG.open;
    const priority = PRIORITY_CONFIG[ticket.priority] ?? PRIORITY_CONFIG.medium;
    const userRole = ticket.user?.role?.slug ?? ticket.user?.role ?? 'client';
    const roleInfo = ROLE_LABEL[userRole] ?? { label: userRole, color: 'bg-gray-100 text-gray-600' };

    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-4 border-b border-gray-100 dark:border-gray-700/50 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/40 ${
                isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-2 border-l-emerald-500' : ''
            }`}
        >
            <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        (ticket.user?.role?.slug || ticket.user?.role) === 'caregiver' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : (ticket.user?.role?.slug || ticket.user?.role) === 'family-member' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                        {(ticket.user?.first_name ?? 'U').charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {ticket.user?.first_name} {ticket.user?.last_name}
                        </p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${roleInfo.color}`}>
                            {roleInfo.label}
                        </span>
                    </div>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0 mt-1">{timeAgo(ticket.updated_at)}</span>
            </div>

            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate mb-1.5">{ticket.subject}</p>

            <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                    {status.icon} {status.label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priority.color}`}>
                    {priority.label}
                </span>
                {(ticket.messages_count ?? 0) > 0 && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {ticket.messages_count}
                    </span>
                )}
            </div>
        </button>
    );
}

// ─── Conversation Panel ──────────────────────────────────────────────────────

function ConversationPanel({ ticket, onStatusChange }: {
    ticket: Ticket;
    onStatusChange: (status: string) => void;
}) {
    const { replyToTicket, loading, updateTicketStatus } = useSupportStore();
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [sending, setSending] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket.messages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() && attachments.length === 0) return;

        setSending(true);
        const formData = new FormData();
        formData.append('message', message);
        attachments.forEach(f => formData.append('attachments[]', f));

        await replyToTicket(ticket.id, formData);

        setMessage('');
        setAttachments([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSending(false);
        setSuccessMsg('Reply sent!');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleStatusChange = async (newStatus: string) => {
        await updateTicketStatus(ticket.id, { status: newStatus });
        onStatusChange(newStatus);
    };

    const isClosed = ticket.status === 'closed';
    const status  = STATUS_CONFIG[ticket.status]  ?? STATUS_CONFIG.open;
    const priority = PRIORITY_CONFIG[ticket.priority] ?? PRIORITY_CONFIG.medium;
    const userRole = ticket.user?.role?.slug ?? ticket.user?.role ?? 'client';
    const roleInfo = ROLE_LABEL[userRole] ?? { label: userRole, color: 'bg-gray-100 text-gray-600' };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                {ticket.ticket_number}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                                {status.icon} {status.label}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.color}`}>
                                {priority.label}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleInfo.color}`}>
                                {roleInfo.label}
                            </span>
                        </div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">{ticket.subject}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            From: <span className="font-medium">{ticket.user?.first_name} {ticket.user?.last_name}</span>
                            {' · '}<span className="capitalize">{ticket.category}</span>
                            {' · '}{new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Quick status actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        {ticket.status !== 'in_progress' && ticket.status !== 'closed' && (
                            <button onClick={() => handleStatusChange('in_progress')}
                                className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 text-amber-700 dark:text-amber-400 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors font-medium">
                                Mark In Progress
                            </button>
                        )}
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                            <button onClick={() => handleStatusChange('resolved')}
                                className="text-xs px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 dark:text-emerald-400 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors font-medium">
                                Mark Resolved
                            </button>
                        )}
                        {ticket.status !== 'closed' && (
                            <button onClick={() => handleStatusChange('closed')}
                                className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 dark:text-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium">
                                Close
                            </button>
                        )}
                        {ticket.status === 'closed' && (
                            <button onClick={() => handleStatusChange('open')}
                                className="text-xs px-3 py-1.5 rounded-lg border border-blue-300 text-blue-600 dark:text-blue-400 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium">
                                Reopen
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50 dark:bg-gray-900/30">

                {/* Original message */}
                <div className="flex gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        (ticket.user?.role?.slug || ticket.user?.role) === 'caregiver' ? 'bg-amber-100 text-amber-700'
                        : (ticket.user?.role?.slug || ticket.user?.role) === 'family-member' ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {(ticket.user?.first_name ?? 'U').charAt(0)}
                    </div>
                    <div className="flex-1 max-w-[80%]">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {ticket.user?.first_name} {ticket.user?.last_name}
                                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-medium ${roleInfo.color}`}>
                                        {roleInfo.label}
                                    </span>
                                </span>
                                <span className="text-[11px] text-gray-400">{new Date(ticket.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {ticket.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reply messages */}
                {ticket.messages?.map((msg) => {
                    const isAdminMsg = msg.is_admin_reply;
                    const senderRole = msg.user?.role?.slug ?? msg.user?.role ?? (isAdminMsg ? 'admin' : 'client');
                    const senderInfo = ROLE_LABEL[senderRole] ?? { label: senderRole, color: 'bg-gray-100 text-gray-600' };

                    return (
                        <div key={msg.id} className={`flex gap-3 ${isAdminMsg ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                isAdminMsg
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : senderRole === 'caregiver' ? 'bg-amber-100 text-amber-700'
                                    : senderRole === 'family-member' ? 'bg-rose-100 text-rose-700'
                                    : 'bg-emerald-100 text-emerald-700'
                            }`}>
                                {(msg.user?.first_name ?? (isAdminMsg ? 'A' : 'U')).charAt(0)}
                            </div>

                            <div className={`flex-1 max-w-[80%] ${isAdminMsg ? 'flex flex-col items-end' : ''}`}>
                                <div className={`rounded-2xl p-4 shadow-sm border ${
                                    isAdminMsg
                                        ? 'bg-blue-600 dark:bg-blue-700 border-blue-500 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-tl-none'
                                }`}>
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <span className={`font-semibold text-sm flex items-center gap-2 ${isAdminMsg ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                            {msg.user?.first_name} {msg.user?.last_name}
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                                isAdminMsg
                                                    ? 'bg-white/20 text-white'
                                                    : senderInfo.color
                                            }`}>
                                                {isAdminMsg ? 'Admin' : senderInfo.label}
                                            </span>
                                        </span>
                                        <span className={`text-[11px] flex-shrink-0 ${isAdminMsg ? 'text-blue-200' : 'text-gray-400'}`}>
                                            {new Date(msg.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm whitespace-pre-wrap leading-relaxed ${isAdminMsg ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {msg.message}
                                    </p>

                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {msg.attachments.map(att => (
                                                <a key={att.id} href={`/storage/${att.file_path}`} target="_blank" rel="noreferrer"
                                                    className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                        isAdminMsg
                                                            ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                                                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                                                    }`}>
                                                    <FileIcon className="w-3.5 h-3.5" />
                                                    {att.file_name}
                                                    <Download className="w-3 h-3 opacity-60" />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
            </div>

            {/* Reply box */}
            {!isClosed ? (
                <div className="flex-shrink-0 p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {successMsg && (
                        <div className="mb-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300 px-3 py-2 rounded-lg">
                            <CheckCircle className="w-4 h-4" /> {successMsg}
                        </div>
                    )}

                    {attachments.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                            {attachments.map((file, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-2.5 py-1 rounded-lg text-xs">
                                    <FileIcon className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{file.name}</span>
                                    <button type="button" onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                                        className="text-gray-400 hover:text-red-500 ml-1">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSend} className="flex gap-3 items-end">
                        <div className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder={`Reply to ${ticket.user?.first_name ?? 'user'}...`}
                                className="w-full bg-transparent border-0 focus:ring-0 resize-none p-3 text-sm text-gray-900 dark:text-white placeholder-gray-400"
                                rows={2}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }
                                }}
                            />
                            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center">
                                <span className="text-[10px] text-gray-400">Enter to send · Shift+Enter new line</span>
                                <div className="flex items-center gap-1">
                                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()}
                                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors">
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button type="submit"
                            disabled={sending || (!message.trim() && attachments.length === 0)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl disabled:opacity-50 transition-colors shadow-sm disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center">
                            {sending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex-shrink-0 p-5 text-center border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <AlertCircle className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">This ticket is closed.</p>
                    <button onClick={() => handleStatusChange('open')}
                        className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Reopen ticket
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminSupportIndex() {
    const { tickets, loading, ticketLoading, currentTicket, fetchTickets, fetchTicketDetails } = useSupportStore();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ status: 'all', priority: 'all', category: 'all' });

    useEffect(() => {
        fetchTickets(1, filters);
    }, [filters]);

    const handleSelectTicket = async (id: number) => {
        setSelectedId(id);
        await fetchTicketDetails(id);
    };

    const filtered = tickets.filter(t => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            t.subject?.toLowerCase().includes(q) ||
            t.ticket_number?.toLowerCase().includes(q) ||
            `${t.user?.first_name} ${t.user?.last_name}`.toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout header={
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Support Centre</h2>
        }>
            <Head title="Support Management" />

            <div className="flex h-[calc(100vh-64px)] overflow-hidden">

                {/* ── LEFT: Ticket list ── */}
                <div className="w-80 lg:w-96 flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">

                    {/* Search + filter bar */}
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 space-y-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search tickets…"
                                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={filters.status}
                                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                                className="flex-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 dark:text-white">
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                            <select
                                value={filters.priority}
                                onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
                                className="flex-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 dark:text-white">
                                <option value="all">All Priority</option>
                                <option value="emergency">Emergency</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Ticket count */}
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</span>
                        <button onClick={() => fetchTickets(1, filters)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Ticket list */}
                    <div className="flex-1 overflow-y-auto">
                        {loading && filtered.length === 0 ? (
                            <div className="p-6 space-y-4">
                                {[1,2,3].map(n => (
                                    <div key={n} className="space-y-2 animate-pulse">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                                            <div className="flex-1 space-y-1.5">
                                                <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                                                <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
                                <p className="text-sm font-medium">No tickets found</p>
                                <p className="text-xs">Try adjusting your filters</p>
                            </div>
                        ) : (
                            filtered.map(ticket => (
                                <TicketListItem
                                    key={ticket.id}
                                    ticket={ticket}
                                    isSelected={selectedId === ticket.id}
                                    onClick={() => handleSelectTicket(ticket.id)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* ── RIGHT: Conversation ── */}
                <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
                    {selectedId && ticketLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
                            <p className="text-sm text-gray-500">Loading ticket...</p>
                        </div>
                    ) : currentTicket && selectedId === currentTicket.id ? (
                        <ConversationPanel
                            ticket={currentTicket}
                            onStatusChange={() => fetchTickets(1, filters)}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <MessageSquare className="w-10 h-10 opacity-40" />
                            </div>
                            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">Select a conversation</p>
                            <p className="text-sm text-gray-400 mt-1">Choose a support ticket from the list to view and reply</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
