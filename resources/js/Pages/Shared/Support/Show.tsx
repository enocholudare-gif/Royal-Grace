import React, { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayoutShell from '../../../Layouts/AppLayoutShell';
import { useSupportStore } from '../../../Stores/supportStore';
import { TicketStatusBadge } from '../../../Components/Support/TicketStatusBadge';
import { TicketPriorityBadge } from '../../../Components/Support/TicketPriorityBadge';
import { SupportTimeline } from '../../../Components/Support/SupportTimeline';
import { TicketConversation } from '../../../Components/Support/TicketConversation';
import { LoadingSkeleton } from '../../../Components/Support/LoadingSkeleton';
import { ChevronLeft } from 'lucide-react';

export default function Show({ ticketId }: { ticketId: number }) {
    const { currentTicket, loading, fetchTicketDetails } = useSupportStore();
    const { auth } = usePage<any>().props;

    useEffect(() => {
        fetchTicketDetails(ticketId);
    }, [ticketId, fetchTicketDetails]);

    const isAdmin = (auth.user.role?.slug || auth.user.role) === 'admin' || (auth.user.role?.slug || auth.user.role) === 'super-admin';

    return (
        <AppLayoutShell
            header={
                <div className="flex items-center gap-4">
                    <Link href={isAdmin ? "/admin/support" : "/support"} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Ticket Details
                    </h2>
                </div>
            }
        >
            <Head title={`Ticket ${currentTicket?.ticket_number || ''}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {loading || !currentTicket ? (
                        <LoadingSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                            {currentTicket.ticket_number}
                                        </span>
                                        <TicketStatusBadge status={currentTicket.status} />
                                        <TicketPriorityBadge priority={currentTicket.priority} />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {currentTicket.subject}
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Category: <span className="capitalize">{currentTicket.category}</span>
                                    </p>
                                </div>

                                <TicketConversation ticket={currentTicket} isAdmin={isAdmin} />
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Ticket Info</h3>
                                    
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-xs text-gray-500 dark:text-gray-400">Requested By</dt>
                                            <dd className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                                {currentTicket.user?.first_name} {currentTicket.user?.last_name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-gray-500 dark:text-gray-400">Assigned To</dt>
                                            <dd className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                                {currentTicket.assignee ? `${currentTicket.assignee.first_name} ${currentTicket.assignee.last_name}` : 'Unassigned'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <SupportTimeline ticket={currentTicket} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayoutShell>
    );
}
