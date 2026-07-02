import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import ClientLayout from '../../Layouts/ClientLayout';
import CaregiverLayout from '../../Layouts/CaregiverLayout';
import FamilyLayout from '../../Layouts/FamilyLayout';
import axios from 'axios';

export default function Index() {
    const { auth } = usePage().props;
    const currentUserId = auth.user.id;
    
    const [activeChat, setActiveChat] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const params = new URLSearchParams(window.location.search);
            const initialChatId = params.get('conversation') ? parseInt(params.get('conversation')) : null;

            const res = await axios.get('/messages/conversations');
            setConversations(res.data.data);
            
            if (initialChatId && res.data.data.find(c => c.id === initialChatId)) {
                setActiveChat(initialChatId);
            } else if (res.data.data.length > 0 && !activeChat) {
                setActiveChat(res.data.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        }
    };

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat);
            // Polling every 5 seconds for new messages
            const interval = setInterval(() => fetchMessages(activeChat), 5000);
            return () => clearInterval(interval);
        }
    }, [activeChat]);

    const fetchMessages = async (conversationId) => {
        try {
            const res = await axios.get(`/messages/conversations/${conversationId}/messages`);
            setMessages(res.data.data.reverse()); // Assuming backend returns newest first
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeChat) return;
        
        const tempMsg = newMessage;
        setNewMessage(''); // optimistic clear
        
        try {
            const res = await axios.post(`/messages/conversations/${activeChat}/messages`, {
                body: tempMsg
            });
            setMessages([...messages, res.data.data]);
        } catch (error) {
            console.error("Failed to send message", error);
            setNewMessage(tempMsg); // restore on fail
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const startAdminConversation = async () => {
        try {
            // Hardcoded user 1 as Admin for demo purposes
            const res = await axios.post('/messages/conversations', {
                subject: 'Support Ticket',
                type: 'support',
                participant_ids: [1]
            });
            await fetchConversations();
            setActiveChat(res.data.data.id);
        } catch (error) {
            console.error("Failed to start conversation", error);
        }
    };

    const getChatName = (conv) => {
        if (!conv) return '';
        const other = conv.participants?.find(p => p.id !== currentUserId);
        return other ? other.name : (conv.subject || 'Chat');
    };

    const getChatRole = (conv) => {
        if (!conv) return '';
        const other = conv.participants?.find(p => p.id !== currentUserId);
        return other?.role || 'User';
    };

    const activeConversation = conversations.find(c => c.id === activeChat);

    return (
        <>
            <Head title="Messages" />
            
            <div className="card overflow-hidden flex h-[700px] border border-border shadow-sm mt-6">
                {/* Sidebar Contacts */}
                <div className="w-80 border-r border-border bg-surface flex flex-col flex-shrink-0">
                    <div className="p-4 border-b border-border">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-bold text-text">Messages</h2>
                            {conversations.length === 0 && (
                                <button onClick={startAdminConversation} className="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded font-bold hover:bg-brand-100">
                                    + Support
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search conversations..." 
                                className="input-standard w-full pl-9 py-2 text-sm"
                            />
                            <svg className="w-4 h-4 text-text-muted absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-center text-text-muted text-sm">
                                <p>No active conversations.</p>
                                <button onClick={startAdminConversation} className="mt-4 btn-primary py-2 px-4 w-full text-xs">Start Support Chat</button>
                            </div>
                        ) : conversations.map(contact => (
                            <button 
                                key={contact.id}
                                onClick={() => setActiveChat(contact.id)}
                                className={`w-full text-left p-4 border-b border-border hover:bg-surface-subtle transition-colors flex gap-3 ${activeChat === contact.id ? 'bg-brand-50 border-l-4 border-l-brand-500 border-b-border' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm flex-shrink-0 uppercase">
                                        {getChatName(contact).charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-sm font-bold text-text truncate">{getChatName(contact)}</h3>
                                    </div>
                                    <p className="text-xs text-text-muted truncate">
                                        {contact.last_message?.body || 'New conversation'}
                                    </p>
                                </div>
                                {contact.unread_count > 0 && (
                                    <div className="w-5 h-5 bg-brand-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-1">
                                        {contact.unread_count}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-[#0f172a]">
                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm uppercase">
                                        {getChatName(activeConversation).charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-text">{getChatName(activeConversation)}</h2>
                                        <p className="text-xs text-text-muted capitalize">{getChatRole(activeConversation)}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-text-muted hover:text-brand-600 rounded-full hover:bg-surface-subtle transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                </button>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map(msg => {
                                    const isMe = msg.sender_user_id === currentUserId;
                                    const senderName = isMe ? 'Me' : (msg.sender?.name || 'User');
                                    
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                                {!isMe && (
                                                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-auto uppercase">
                                                        {senderName.charAt(0)}
                                                    </div>
                                                )}
                                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className={`px-4 py-2.5 rounded-2xl ${
                                                        isMe 
                                                            ? 'bg-brand-600 text-white rounded-br-none' 
                                                            : 'bg-surface text-text border border-border rounded-bl-none shadow-sm'
                                                    }`}>
                                                        <p className={`text-sm ${isMe ? 'text-white' : ''}`}>{msg.body}</p>
                                                    </div>
                                                    <span className={`text-[10px] mt-1 px-1 text-text-muted`}>
                                                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 bg-surface border-t border-border flex-shrink-0">
                                <div className="flex items-end gap-2 bg-surface-subtle p-2 rounded-xl border border-border focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-shadow">
                                    <button className="p-2 text-text-muted hover:text-brand-600 rounded-full transition-colors flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                    </button>
                                    <textarea 
                                        rows="1"
                                        placeholder="Type a message..."
                                        className="w-full bg-transparent border-none focus:ring-0 resize-none py-2 text-sm text-text placeholder-text-muted"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    ></textarea>
                                    <button 
                                        onClick={handleSendMessage}
                                        className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full transition-colors flex-shrink-0 shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-text-muted">
                            <div className="text-center">
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                <p>Select a conversation to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => {
    const role = page.props.auth?.user?.role;
    
    if (role === 'client') return <ClientLayout title="Messages" description="Chat with your care team">{page}</ClientLayout>;
    if (role === 'caregiver') return <CaregiverLayout title="Messages" description="Communicate with clients and staff">{page}</CaregiverLayout>;
    if (role === 'family-member') return <FamilyLayout title="Messages" description="Communicate with care team and staff">{page}</FamilyLayout>;
    
    return (
        <AuthLayout 
            title="Messages" 
            description="Unified communications center"
            roleLabel="Admin Workspace"
            navigation={[
                { label: 'Overview', href: '/admin/dashboard', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
                { label: 'Clients', href: '/admin/clients', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
                { label: 'Caregivers', href: '/admin/caregivers', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> },
                { label: 'Messages', href: '/messages', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg> },
            ]}
        >
            {page}
        </AuthLayout>
    );
};
