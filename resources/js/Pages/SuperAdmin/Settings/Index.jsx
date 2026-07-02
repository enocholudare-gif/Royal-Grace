import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ settings }) {
    // We expect settings to be grouped: { general: { site_name: { value: '...', is_public: 1 } } }
    // Let's flatten this for the form state
    const initialSettings = { ...settings };
    
    // Default fallback if no settings exist
    if (!initialSettings.general) {
        initialSettings.general = {
            site_name: { value: 'Royal Grace Care', is_public: 1 },
            contact_email: { value: 'info@royalgrace.com', is_public: 1 },
        };
    }
    
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        settings: initialSettings,
    });

    const updateSetting = (group, key, value) => {
        setData('settings', {
            ...data.settings,
            [group]: {
                ...data.settings[group],
                [key]: {
                    ...data.settings[group]?.[key],
                    value: value,
                    is_public: data.settings[group]?.[key]?.is_public ?? true
                }
            }
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post('/super-admin/settings', {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Platform Settings" description="Configure global variables and application behavior.">
            <Head title="Platform Settings" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-text">Platform Settings</h2>
                    <p className="text-sm text-text-muted">These settings affect the global behavior of the application.</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6 max-w-4xl">
                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-surface-subtle">
                        <h3 className="text-lg font-medium text-text">General Settings</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Site Name</label>
                                <input
                                    type="text"
                                    value={data.settings.general?.site_name?.value || ''}
                                    onChange={(e) => updateSetting('general', 'site_name', e.target.value)}
                                    className="w-full rounded-md border-border shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                />
                                <p className="text-xs text-text-muted mt-1">Used in email headers and page titles.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    value={data.settings.general?.contact_email?.value || ''}
                                    onChange={(e) => updateSetting('general', 'contact_email', e.target.value)}
                                    className="w-full rounded-md border-border shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                />
                                <p className="text-xs text-text-muted mt-1">The primary email for support and notifications.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    {recentlySuccessful && <span className="text-sm text-green-600 mr-4">Saved successfully.</span>}
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 font-medium disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
