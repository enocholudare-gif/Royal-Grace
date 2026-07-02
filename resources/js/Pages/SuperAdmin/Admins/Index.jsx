import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ admins }) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submitCreate = (e) => {
        e.preventDefault();
        post('/super-admin/admins', {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            },
        });
    };

    const handleDelete = (admin) => {
        if (confirm(`Are you sure you want to delete ${admin.name}?`)) {
            router.delete(`/super-admin/admins/${admin.id}`);
        }
    };

    return (
        <AdminLayout title="Manage Admins" description="Add, update, or remove administrative users.">
            <Head title="Manage Admins" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-text">Administrators</h2>
                    <p className="text-sm text-text-muted">Users with full admin access to the platform.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 text-sm font-medium"
                >
                    + Add New Admin
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-left text-sm text-text">
                    <thead className="bg-surface-subtle text-text-soft">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Phone</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Joined</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-surface-subtle/50 transition">
                                <td className="px-6 py-4 font-medium text-text">{admin.name}</td>
                                <td className="px-6 py-4">{admin.email}</td>
                                <td className="px-6 py-4">{admin.phone || '—'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {admin.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{admin.created_at}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(admin)}
                                        className="text-red-600 hover:text-red-900 font-medium"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {admins.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-text-muted">
                                    No admins found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-text">Create New Admin</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-text-soft hover:text-text">&times;</button>
                        </div>
                        <form onSubmit={submitCreate}>
                            <div className="px-6 py-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1">First Name</label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className="w-full rounded-md border-border shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                            required
                                        />
                                        {errors.first_name && <p className="text-red-600 text-xs mt-1">{errors.first_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className="w-full rounded-md border-border shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                            required
                                        />
                                        {errors.last_name && <p className="text-red-600 text-xs mt-1">{errors.last_name}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-md border-border shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        required
                                    />
                                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Phone (optional)</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-md border-border shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                    />
                                    {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full rounded-md border-border shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        required
                                    />
                                    {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full rounded-md border-border shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 text-right space-x-3 rounded-b-xl border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                                >
                                    {processing ? 'Saving...' : 'Create Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
