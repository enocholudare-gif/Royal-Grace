import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ShieldIcon, UsersIcon, SettingsIcon, DashboardIcon } from '@/Components/Layout/icons';

export default function SuperAdminDashboard() {
    return (
        <AdminLayout 
            title="Super Admin Dashboard" 
            description="Welcome to your top-level platform overview. You have full access."
        >
            <Head title="Super Admin Dashboard" />

            <div className="space-y-6">
                <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                            <ShieldIcon className="h-8 w-8 text-brand-300" />
                            Super Administrator Portal
                        </h1>
                        <p className="text-brand-100 max-w-xl">
                            You have elevated privileges allowing you to manage other administrators and configure global platform settings.
                        </p>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <ShieldIcon className="h-48 w-48" />
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-text mt-8 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/super-admin/admins" className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md hover:border-brand-300 transition group flex flex-col items-start">
                        <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <UsersIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-1">Manage Admins</h3>
                        <p className="text-sm text-text-muted">Add, remove, or modify regular administrator accounts.</p>
                    </Link>

                    <Link href="/super-admin/settings" className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md hover:border-brand-300 transition group flex flex-col items-start">
                        <div className="h-12 w-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <SettingsIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-1">Platform Settings</h3>
                        <p className="text-sm text-text-muted">Configure global application variables and behaviors.</p>
                    </Link>

                    <Link href="/admin/dashboard" className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md hover:border-brand-300 transition group flex flex-col items-start">
                        <div className="h-12 w-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <DashboardIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-1">Standard Dashboard</h3>
                        <p className="text-sm text-text-muted">View regular metrics like bookings, revenue, and clients.</p>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
