import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { FileText, CreditCard, Clock, AlertCircle } from 'lucide-react';

export default function Index({ auth, invoices }) {
    return (
        <ClientLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Invoices</h2>}>
            <Head title="My Invoices" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoices.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">You have no invoices yet.</td>
                                        </tr>
                                    ) : invoices.data.map((invoice) => (
                                        <tr key={invoice.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {invoice.invoice_number}
                                                <div className="text-xs text-gray-500 font-normal">Due: {invoice.due_date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {invoice.booking?.service?.name || 'Service Package'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                ${invoice.total_amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${['paid', 'issued'].includes(invoice.status) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {invoice.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {(invoice.status === 'draft' || invoice.status === 'rejected') && (
                                                    <Link href={`/client/invoices/${invoice.id}/pay`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900">
                                                        <CreditCard size={16} /> Pay Now
                                                    </Link>
                                                )}
                                                {invoice.status === 'payment_submitted' && (
                                                    <span className="inline-flex items-center gap-1 text-gray-500">
                                                        <Clock size={16} /> Under Review
                                                    </span>
                                                )}
                                                {invoice.status === 'paid' && (
                                                    <a href={`/client/invoices/${invoice.id}/download`} className="inline-flex items-center gap-1 text-green-600 hover:text-green-900">
                                                        <FileText size={16} /> Download
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
