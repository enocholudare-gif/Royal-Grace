import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit, Trash, CheckCircle, XCircle } from 'lucide-react';

export default function Index({ auth, accounts }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors } = useForm({
        bank_name: '',
        account_name: '',
        account_number: '',
        branch: '',
        swift_code: '',
        instructions: '',
        is_active: false,
    });

    const openCreateModal = () => {
        reset();
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (account) => {
        setData({
            bank_name: account.bank_name,
            account_name: account.account_name,
            account_number: account.account_number,
            branch: account.branch || '',
            swift_code: account.swift_code || '',
            instructions: account.instructions || '',
            is_active: account.is_active,
        });
        setEditingId(account.id);
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(`/admin/bank-accounts/${editingId}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/admin/bank-accounts', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this bank account?')) {
            destroy(`/admin/bank-accounts/${id}`);
        }
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Bank Accounts</h2>}>
            <Head title="Manage Bank Accounts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Bank Account Configuration</h3>
                            <button onClick={openCreateModal} className="px-4 py-2 bg-[#0A192F] text-[#D4AF37] rounded-md flex items-center gap-2 hover:bg-[#102240] transition">
                                <Plus size={16} /> Add Bank Account
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {accounts.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No bank accounts configured yet.</td>
                                        </tr>
                                    ) : accounts.map((account) => (
                                        <tr key={account.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{account.bank_name}</div>
                                                <div className="text-sm text-gray-500">{account.account_name}</div>
                                                <div className="text-sm text-gray-500">{account.account_number}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{account.instructions || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {account.is_active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle size={14} className="mr-1" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        <XCircle size={14} className="mr-1" /> Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => openEditModal(account)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(account.id)} className="text-red-600 hover:text-red-900"><Trash size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Bank Account' : 'Add Bank Account'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                                <input type="text" value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                {errors.bank_name && <div className="text-red-600 text-sm mt-1">{errors.bank_name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Account Name</label>
                                <input type="text" value={data.account_name} onChange={e => setData('account_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                {errors.account_name && <div className="text-red-600 text-sm mt-1">{errors.account_name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                                <input type="text" value={data.account_number} onChange={e => setData('account_number', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                {errors.account_number && <div className="text-red-600 text-sm mt-1">{errors.account_number}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Branch (Optional)</label>
                                <input type="text" value={data.branch} onChange={e => setData('branch', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">SWIFT Code (Optional)</label>
                                <input type="text" value={data.swift_code} onChange={e => setData('swift_code', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Instructions</label>
                                <textarea value={data.instructions} onChange={e => setData('instructions', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows="3"></textarea>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded border-gray-300 text-indigo-600 shadow-sm" />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (Displays to clients)</label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
