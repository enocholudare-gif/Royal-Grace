import React from 'react';
import { Link } from '@inertiajs/react';
import { Clock, MessageCircle } from 'lucide-react';
import { Ticket } from '../../Stores/supportStore';
import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';

interface TicketCardProps {
    ticket: Ticket;
    isAdmin?: boolean;
}

export function TicketCard({ ticket, isAdmin = false }: TicketCardProps) {
    const formattedDate = new Date(ticket.updated_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    return (
        <Link 
            href={isAdmin ? `/admin/support/${ticket.id}` : `/support/${ticket.id}`}
            className="block bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                            {ticket.ticket_number}
                        </span>
                        <TicketStatusBadge status={ticket.status} />
                        <TicketPriorityBadge priority={ticket.priority} />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {ticket.subject}
                    </h3>
                </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                {ticket.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        Updated {formattedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" />
                        {ticket.messages_count || 0} Replies
                    </span>
                </div>
                
                {isAdmin && ticket.user && (
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                        {ticket.user.first_name} {ticket.user.last_name}
                    </span>
                )}
            </div>
        </Link>
    );
}
