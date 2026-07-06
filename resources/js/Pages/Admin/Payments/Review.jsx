import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Download, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default function Review({ auth, submission }) {
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectBox, setShowRejectBox] = useState(false);

    const { post, processing } = useForm({});

    const handleApprove = () => {
        if (confirm('Approve this payment?')) {
            post(`/admin/payments/${submission.id}/approve`);
        }
    };

    const handleReject = () => {
        if (!rejectReason) {
            alert('Please provide a rejection reason.');
            return;
        }
        if (confirm('Reject this payment?')) {
            useForm({ rejection_reason: rejectReason }).post(`/admin/payments/${submission.id}/reject`);
        }
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Review Payment #{submission.invoice?.invoice_number}</h2>}>
            <Head title="Review Payment" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <Link href={`/admin/payments/pending`} className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-900 mb-6 font-medium">
                        <ArrowLeft size={16} /> Back to Pending
                    </Link>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="font-bold text-gray-700">Client:</span> {submission.invoice?.booking?.client?.user?.first_name} {submission.invoice?.booking?.client?.user?.last_name}</div>
                            <div><span className="font-bold text-gray-700">Amount Due:</span> ${submission.invoice?.total_amount}</div>
                            <div><span className="font-bold text-gray-700">Date Submitted:</span> {new Date(submission.created_at).toLocaleString()}</div>
                            <div><span className="font-bold text-gray-700">Reference:</span> {submission.transaction_reference || 'N/A'}</div>
                            <div className="col-span-2"><span className="font-bold text-gray-700">Client Note:</span> {submission.note || 'None'}</div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-bold text-lg mb-3">Proof of Payment</h3>
                            {submission.receipt_path.endsWith('.pdf') ? (
                                <a href={`/admin/payments/${submission.id}/receipt`} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                                    <Download size={16} /> Download PDF Receipt
                                </a>
                            ) : (
                                <div className="border rounded-md p-2">
                                    <img src={`/storage/${submission.receipt_path}`} alt="Receipt" className="max-w-full h-auto rounded" />
                                </div>
                            )}
                        </div>

                        {submission.status === 'pending' && (
                            <div className="border-t pt-4 flex items-start gap-4">
                                <button disabled={processing} onClick={handleApprove} className="px-6 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 font-bold hover:bg-green-700 transition">
                                    <CheckCircle size={18} /> Approve Payment
                                </button>
                                <div className="flex-1">
                                    {!showRejectBox ? (
                                        <button onClick={() => setShowRejectBox(true)} className="px-6 py-2 bg-red-600 text-white rounded-md flex items-center gap-2 font-bold hover:bg-red-700 transition">
                                            <XCircle size={18} /> Reject Payment
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection..." className="flex-1 rounded-md border-gray-300 shadow-sm" />
                                            <button onClick={handleReject} disabled={processing} className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700">Confirm Reject</button>
                                            <button onClick={() => setShowRejectBox(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Cancel</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {submission.status !== 'pending' && (
                            <div className="border-t pt-4">
                                <p className="text-gray-700 font-bold">Status: <span className="uppercase">{submission.status}</span></p>
                                {submission.rejection_reason && <p className="text-red-600 mt-2">Reason: {submission.rejection_reason}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
