import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { Upload, Download, Info, CheckCircle, AlertCircle, ArrowLeft, CreditCard, Building2, Copy } from 'lucide-react';

function formatPrice(price) {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price);
}

export default function MakePayment({ auth, invoice, bankAccount }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [copied, setCopied] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        receipt: null,
        transaction_reference: '',
        note: ''
    });

    const copyText = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/client/invoices/${invoice.id}/submit-receipt`);
    };

    if (!bankAccount) {
        return (
            <ClientLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Payment Unavailable</h2>}>
                <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">Payment details are currently unavailable</p>
                    <p className="text-sm">An admin needs to set up a bank account first. Please contact support.</p>
                    <Link href="/client/invoices" className="mt-6 inline-flex items-center gap-2 text-indigo-600 hover:underline">
                        <ArrowLeft size={16} /> Back to Invoices
                    </Link>
                </div>
            </ClientLayout>
        );
    }

    return (
        <ClientLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Make Payment</h2>}>
            <Head title="Make Payment" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Back link */}
                    <Link href="/client/invoices" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        <ArrowLeft size={16} /> Back to Invoices
                    </Link>

                    {/* Flash success (from new booking) */}
                    {flash.success && (
                        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                            <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-green-800">Booking Confirmed!</p>
                                <p className="text-sm text-green-700">{flash.success}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-5 gap-6">

                        {/* LEFT: Invoice + Bank Details (3/5) */}
                        <div className="md:col-span-3 space-y-5">

                            {/* Invoice Summary Card */}
                            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                                <div className="bg-indigo-600 px-6 py-4">
                                    <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Invoice</p>
                                    <p className="text-white font-bold text-lg mt-0.5">#{invoice.invoice_number}</p>
                                </div>
                                <div className="p-6 space-y-3 text-sm">
                                    {invoice.booking?.service?.name && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Service</span>
                                            <span className="font-medium text-gray-900">{invoice.booking.service.name}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="text-gray-900">{formatPrice(invoice.subtotal_amount ?? invoice.total_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tax</span>
                                        <span className="text-gray-900">{formatPrice(invoice.tax_amount ?? 0)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-base border-t pt-3">
                                        <span className="text-gray-900">Total Due</span>
                                        <span className="text-indigo-600 text-lg">{formatPrice(invoice.total_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Due Date</span>
                                        <span>{invoice.due_date}</span>
                                    </div>
                                </div>
                                <div className="px-6 pb-5">
                                    <a
                                        href={`/client/invoices/${invoice.id}/download`}
                                        className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 border border-indigo-500 text-indigo-600 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition"
                                    >
                                        <Download size={16} /> Download Invoice PDF
                                    </a>
                                </div>
                            </div>

                            {/* Bank Transfer Details */}
                            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 size={20} className="text-indigo-600" />
                                    <h3 className="text-base font-bold text-gray-900">Bank Transfer Details</h3>
                                </div>

                                <div className="space-y-3 text-sm">
                                    {[
                                        { label: 'Bank Name', value: bankAccount.bank_name, key: 'bank' },
                                        { label: 'Account Name', value: bankAccount.account_name, key: 'name' },
                                        { label: 'Account Number', value: bankAccount.account_number, key: 'acc', mono: true },
                                        bankAccount.branch && { label: 'Branch / Sort Code', value: bankAccount.branch, key: 'branch' },
                                        bankAccount.swift_code && { label: 'SWIFT / BIC', value: bankAccount.swift_code, key: 'swift', mono: true },
                                        { label: 'Payment Reference', value: invoice.invoice_number, key: 'ref', mono: true, highlight: true },
                                    ].filter(Boolean).map(field => (
                                        <div key={field.key} className={`flex items-center justify-between p-3 rounded-lg ${field.highlight ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
                                            <div>
                                                <p className={`text-xs font-medium mb-0.5 ${field.highlight ? 'text-amber-700' : 'text-gray-500'}`}>
                                                    {field.highlight && '⚠️ '}{field.label}
                                                </p>
                                                <p className={`font-bold ${field.mono ? 'font-mono' : ''} ${field.highlight ? 'text-amber-900' : 'text-gray-900'}`}>
                                                    {field.value}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => copyText(field.value, field.key)}
                                                className="text-gray-400 hover:text-indigo-600 transition p-1.5 rounded-md hover:bg-indigo-50"
                                                title="Copy"
                                            >
                                                {copied === field.key
                                                    ? <CheckCircle size={16} className="text-green-500" />
                                                    : <Copy size={16} />
                                                }
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {bankAccount.instructions && (
                                    <div className="mt-4 bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800 flex items-start gap-3">
                                        <Info size={18} className="shrink-0 mt-0.5 text-indigo-500" />
                                        <span>{bankAccount.instructions}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Upload Receipt (2/5) */}
                        <div className="md:col-span-2">
                            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 sticky top-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard size={18} className="text-green-600" />
                                    <h3 className="text-base font-bold text-gray-900">Confirm Your Payment</h3>
                                </div>
                                <p className="text-gray-500 text-sm mb-5">
                                    After completing the bank transfer, upload your receipt here.
                                </p>

                                <form onSubmit={submit} className="space-y-4">
                                    {/* File Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Receipt / Screenshot <span className="text-red-500">*</span>
                                        </label>
                                        <label
                                            htmlFor="receipt"
                                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition
                                                ${data.receipt ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'}`}
                                        >
                                            {data.receipt ? (
                                                <div className="text-center">
                                                    <CheckCircle size={28} className="mx-auto text-green-500 mb-1" />
                                                    <p className="text-sm font-semibold text-green-700 px-2 truncate max-w-[180px]">{data.receipt.name}</p>
                                                    <p className="text-xs text-green-600">Click to change</p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Upload size={28} className="mx-auto text-gray-400 mb-1" />
                                                    <p className="text-sm text-gray-500">Click to upload</p>
                                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF — max 5MB</p>
                                                </div>
                                            )}
                                            <input
                                                id="receipt"
                                                type="file"
                                                className="sr-only"
                                                onChange={e => setData('receipt', e.target.files[0])}
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                required
                                            />
                                        </label>
                                        {errors.receipt && <p className="text-red-500 text-xs mt-1">{errors.receipt}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Reference</label>
                                        <input
                                            type="text"
                                            value={data.transaction_reference}
                                            onChange={e => setData('transaction_reference', e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            placeholder="e.g. TR-987654321"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Note to Admin</label>
                                        <textarea
                                            value={data.note}
                                            onChange={e => setData('note', e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            rows={3}
                                            placeholder="Any additional info..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
                                    >
                                        {processing ? 'Submitting...' : (
                                            <><CheckCircle size={16} /> Submit Payment Proof</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
