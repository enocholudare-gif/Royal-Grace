import React from 'react';
import { BellOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationEmptyState: React.FC = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800"
        >
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <BellOff className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No notifications yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                When you get notifications for bookings, visits, messages, or updates, they'll show up here.
            </p>
        </motion.div>
    );
};
