import React from 'react';

export function TicketPriorityBadge({ priority }: { priority: string }) {
    const config: Record<string, { bg: string, text: string, label: string, icon?: string }> = {
        low: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', label: 'Low' },
        medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-500', label: 'Medium' },
        high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', label: 'High' },
        emergency: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400 font-bold animate-pulse', label: 'Emergency', icon: '🚨' },
    };

    const style = config[priority] || config.medium;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            {style.icon && <span>{style.icon}</span>}
            {style.label}
        </span>
    );
}
