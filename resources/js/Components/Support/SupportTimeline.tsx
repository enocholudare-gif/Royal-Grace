import React from 'react';
import { Clock, CheckCircle, PlusCircle, AlertCircle } from 'lucide-react';
import { Ticket } from '../../Stores/supportStore';

export function SupportTimeline({ ticket }: { ticket: Ticket }) {
    const events = [
        {
            title: 'Ticket Created',
            date: new Date(ticket.created_at),
            icon: PlusCircle,
            color: 'text-emerald-500',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30'
        }
    ];

    if (ticket.status === 'in_progress') {
        events.push({
            title: 'In Progress',
            date: new Date(ticket.updated_at),
            icon: Clock,
            color: 'text-blue-500',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        });
    }

    if (ticket.status === 'resolved' || ticket.resolved_at) {
        events.push({
            title: 'Resolved',
            date: ticket.resolved_at ? new Date(ticket.resolved_at) : new Date(ticket.updated_at),
            icon: CheckCircle,
            color: 'text-purple-500',
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        });
    }

    if (ticket.status === 'closed') {
        events.push({
            title: 'Closed',
            date: new Date(ticket.updated_at),
            icon: AlertCircle,
            color: 'text-gray-500',
            bg: 'bg-gray-100 dark:bg-gray-800'
        });
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Timeline</h3>
            
            <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                {events.map((event, index) => {
                    const Icon = event.icon;
                    return (
                        <div key={index} className="relative pl-6">
                            <span className={`absolute -left-3.5 top-0.5 flex items-center justify-center w-7 h-7 rounded-full ${event.bg} ${event.color} ring-4 ring-white dark:ring-gray-800`}>
                                <Icon className="w-3.5 h-3.5" />
                            </span>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
