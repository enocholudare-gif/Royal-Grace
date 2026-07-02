import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, FileIcon, Download, AlertCircle } from 'lucide-react';
import { Ticket } from '../../Stores/supportStore';
import { useSupportStore } from '../../Stores/supportStore';

export function TicketConversation({ ticket, isAdmin = false }: { ticket: Ticket, isAdmin?: boolean }) {
    const { replyToTicket, loading } = useSupportStore();
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [ticket.messages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setAttachments(prev => [...prev, ...newFiles]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() && attachments.length === 0) return;

        const formData = new FormData();
        formData.append('message', message);
        attachments.forEach(file => {
            formData.append('attachments[]', file);
        });

        await replyToTicket(ticket.id, formData);
        
        // Reset form
        setMessage('');
        setAttachments([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const isClosed = ticket.status === 'closed';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white">Conversation</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Original Ticket Description as first message */}
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold flex-shrink-0">
                        {ticket.user?.first_name.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">
                                {ticket.user?.first_name} {ticket.user?.last_name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {new Date(ticket.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                            {ticket.description}
                        </p>
                        
                        {/* Initial Attachments */}
                        {ticket.attachments && ticket.attachments.filter(a => !a.support_ticket_message_id).length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {ticket.attachments.filter(a => !a.support_ticket_message_id).map(attachment => (
                                    <a 
                                        key={attachment.id}
                                        href={`/storage/${attachment.file_path}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <FileIcon className="w-4 h-4 text-emerald-500" />
                                        {attachment.file_name}
                                        <Download className="w-3 h-3 ml-1 opacity-50" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Conversation Replies */}
                {ticket.messages?.map((msg) => {
                    const isOwnMessage = isAdmin ? msg.is_admin_reply : !msg.is_admin_reply;
                    
                    return (
                        <div key={msg.id} className={`flex gap-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                                msg.is_admin_reply 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                            }`}>
                                {msg.user?.first_name.charAt(0) || (msg.is_admin_reply ? 'A' : 'U')}
                            </div>
                            <div className={`flex-1 rounded-2xl p-4 shadow-sm max-w-[85%] ${
                                isOwnMessage 
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-tr-none' 
                                    : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50 rounded-tl-none'
                            }`}>
                                <div className="flex items-center justify-between mb-2 gap-4">
                                    <span className="font-medium text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                        {msg.user?.first_name} {msg.user?.last_name}
                                        {msg.is_admin_reply && (
                                            <span className="text-[10px] uppercase tracking-wider bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">Admin</span>
                                        )}
                                    </span>
                                    <span className="text-xs text-gray-500 flex-shrink-0">
                                        {new Date(msg.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                    {msg.message}
                                </p>
                                
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {msg.attachments.map(attachment => (
                                            <a 
                                                key={attachment.id}
                                                href={`/storage/${attachment.file_path}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                    isOwnMessage
                                                        ? 'bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-700'
                                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                <FileIcon className={`w-4 h-4 ${isOwnMessage ? 'text-emerald-500' : 'text-gray-400'}`} />
                                                {attachment.file_name}
                                                <Download className="w-3 h-3 ml-1 opacity-50" />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Reply Form */}
            {!isClosed ? (
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
                    {attachments.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                            {attachments.map((file, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-lg text-xs shadow-sm">
                                    <FileIcon className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{file.name}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => removeAttachment(i)}
                                        className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                        <div className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your reply here..."
                                className="w-full bg-transparent border-0 focus:ring-0 resize-none p-3 text-sm text-gray-900 dark:text-white"
                                rows={2}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center">
                                <span className="text-[10px] text-gray-400 font-medium">Press Enter to send, Shift+Enter for new line</span>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileSelect} 
                                    multiple 
                                    className="hidden" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded transition-colors"
                                    title="Attach files"
                                >
                                    <Paperclip className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <button 
                            type="submit"
                            disabled={loading || (!message.trim() && attachments.length === 0)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-xl disabled:opacity-50 transition-colors shadow-sm disabled:cursor-not-allowed flex-shrink-0"
                            title="Send reply"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="p-6 text-center border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                    <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">This ticket is closed and cannot receive new replies.</p>
                </div>
            )}
        </div>
    );
}
