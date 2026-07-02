import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayoutShell from '../../../Layouts/AppLayoutShell';
import { useSupportStore } from '../../../Stores/supportStore';
import { FAQAccordion } from '../../../Components/Support/FAQAccordion';
import { ChevronLeft, LifeBuoy } from 'lucide-react';

export default function FaqPage() {
    const { faqs, loading, fetchFaqs } = useSupportStore();

    useEffect(() => {
        fetchFaqs();
    }, [fetchFaqs]);

    return (
        <AppLayoutShell
            header={
                <div className="flex items-center gap-4">
                    <Link href="/support" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Knowledge Base
                    </h2>
                </div>
            }
        >
            <Head title="FAQ & Knowledge Base" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
                            <LifeBuoy className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How can we help you today?</h1>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Search our knowledge base for quick answers to common questions about our services, billing, and technical support.
                        </p>
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"></div>
                            ))}
                        </div>
                    ) : (
                        <FAQAccordion faqs={faqs} />
                    )}

                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-8 text-center border border-emerald-100 dark:border-emerald-800/30 mt-12">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Can't find what you're looking for?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Our support team is here to help you.</p>
                        <Link 
                            href="/support/create"
                            className="inline-flex bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                        >
                            Open a Support Ticket
                        </Link>
                    </div>

                </div>
            </div>
        </AppLayoutShell>
    );
}
