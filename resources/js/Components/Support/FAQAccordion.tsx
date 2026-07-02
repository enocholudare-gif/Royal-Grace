import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Faq } from '../../Stores/supportStore';

export function FAQAccordion({ faqs }: { faqs: Faq[] }) {
    const [search, setSearch] = useState('');
    const [openId, setOpenId] = useState<number | null>(null);

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(search.toLowerCase()) || 
        faq.answer.toLowerCase().includes(search.toLowerCase()) ||
        faq.category.toLowerCase().includes(search.toLowerCase())
    );

    const categories = Array.from(new Set(filteredFaqs.map(f => f.category)));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                </div>
            </div>

            {filteredFaqs.length === 0 ? (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                    No FAQs found matching your search.
                </div>
            ) : (
                <div className="p-4">
                    {categories.map((category) => (
                        <div key={category} className="mb-6 last:mb-0">
                            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {filteredFaqs.filter(f => f.category === category).map((faq) => (
                                    <div 
                                        key={faq.id} 
                                        className={`border rounded-lg transition-colors ${
                                            openId === faq.id 
                                                ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10' 
                                                : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                            className="flex items-center justify-between w-full p-4 text-left font-medium text-gray-900 dark:text-white focus:outline-none"
                                        >
                                            <span>{faq.question}</span>
                                            <ChevronDown 
                                                className={`w-5 h-5 text-gray-400 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} 
                                            />
                                        </button>
                                        
                                        {openId === faq.id && (
                                            <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 animate-in slide-in-from-top-2 fade-in duration-200">
                                                <div dangerouslySetInnerHTML={{ __html: faq.answer }} className="prose dark:prose-invert max-w-none text-sm" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
