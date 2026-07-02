import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayoutShell from '../../../Layouts/AppLayoutShell';
import { useSupportStore } from '../../../Stores/supportStore';
import { TicketCard } from '../../../Components/Support/TicketCard';
import { LoadingSkeleton } from '../../../Components/Support/LoadingSkeleton';
import { EmergencyBanner } from '../../../Components/Support/EmergencyBanner';
import { Plus, BookOpen, MessageSquare } from 'lucide-react';

export default function Dashboard() {
    const { tickets, loading, fetchTickets } = useSupportStore();

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const openTickets = tickets.filter(t => ['open', 'in_progress'].includes(t.status));
    const closedTickets = tickets.filter(t => ['resolved', 'closed'].includes(t.status));

    return (
        <AppLayoutShell
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Support Center
                    </h2>
                    <Link
                        href="/support/create"
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Ticket
                    </Link>
                </div>
            }
        >
            <Head title="Support Center" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <EmergencyBanner />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <Link 
                            href="/support/faq"
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow group"
                        >
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Knowledge Base & FAQ</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Find quick answers to common questions</p>
                            </div>
                        </Link>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl text-blue-600 dark:text-blue-400">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Active Tickets ({openTickets.length})</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Requests currently being handled</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                Open Requests
                            </h3>
                            
                            {loading && tickets.length === 0 ? (
                                <LoadingSkeleton />
                            ) : openTickets.length === 0 ? (
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-8 text-center border border-dashed border-gray-200 dark:border-gray-700">
                                    <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 dark:text-white">No open tickets</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You don't have any pending support requests.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {openTickets.map(ticket => (
                                        <TicketCard key={ticket.id} ticket={ticket} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                Past Requests
                            </h3>
                            
                            {loading && tickets.length === 0 ? (
                                <LoadingSkeleton />
                            ) : closedTickets.length === 0 ? (
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-8 text-center border border-dashed border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">No history</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your closed and resolved tickets will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {closedTickets.map(ticket => (
                                        <TicketCard key={ticket.id} ticket={ticket} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayoutShell>
    );
}
