import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayoutShell from '../../../Layouts/AppLayoutShell';
import { useSupportStore } from '../../../Stores/supportStore';
import { Send, Paperclip, X, AlertCircle } from 'lucide-react';

export default function Create() {
    const { createTicket, loading, error } = useSupportStore();
    const [formData, setFormData] = useState({
        subject: '',
        category: 'general',
        priority: 'medium',
        description: '',
    });
    const [attachments, setAttachments] = useState<File[]>([]);

    const categories = [
        { id: 'general', label: 'General Inquiry' },
        { id: 'billing', label: 'Billing & Payments' },
        { id: 'scheduling', label: 'Scheduling & Visits' },
        { id: 'caregiver', label: 'Caregiver Issues' },
        { id: 'technical', label: 'Technical Support' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        attachments.forEach(file => {
            data.append('attachments[]', file);
        });

        const newTicket = await createTicket(data);
        if (newTicket) {
            router.visit(`/support/${newTicket.id}`);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    return (
        <AppLayoutShell
            header={
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create Support Ticket
                    </h2>
                </div>
            }
        >
            <Head title="Create Ticket" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 p-4 flex items-center gap-3 border-b border-red-100 dark:border-red-900/50">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    >
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Priority
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    >
                                        <option value="low">Low - General question</option>
                                        <option value="medium">Medium - Needs attention</option>
                                        <option value="high">High - Urgent issue</option>
                                        <option value="emergency">Emergency - Immediate danger/critical</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Brief description of the issue"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={6}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Please provide as much detail as possible..."
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Attachments (Optional)
                                </label>
                                <div className="flex items-center gap-4">
                                    <label className="cursor-pointer bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 border-dashed rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Paperclip className="w-4 h-4" />
                                        <span>Add Files</span>
                                        <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                                    </label>
                                </div>
                                {attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {attachments.map((file, i) => (
                                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                {file.name}
                                                <button type="button" onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="hover:text-red-500">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayoutShell>
    );
}
