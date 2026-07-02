import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AuthAlert from '../../../Components/Auth/AuthAlert';
import AuthInput from '../../../Components/Auth/AuthInput';
import AuthSelect from '../../../Components/Auth/AuthSelect';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Availability({ caregiver }) {
    const [form, setForm] = useState({
        day_of_week: 'monday',
        start_time: '09:00',
        end_time: '17:00',
        is_available: true,
    });
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageTone, setMessageTone] = useState('');
    const [errors, setErrors] = useState({});

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayOptions = days.map(day => ({ value: day, label: day.charAt(0).toUpperCase() + day.slice(1) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setMessage('');

        try {
            await axios.post(`/caregivers/${caregiver.id}/availability`, form);
            setMessage('Availability added successfully.');
            setMessageTone('success');
            router.reload({ only: ['caregiver'] });
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setMessage(error.response?.data?.message || 'An error occurred.');
                setMessageTone('danger');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Caregiver Availability" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href={`/admin/caregivers/${caregiver.id}`} className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to {caregiver.first_name}
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Availability Settings</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Manage available days and hours for {caregiver.first_name} {caregiver.last_name}.
                        </p>
                    </div>
                </div>

                {message && (
                    <AuthAlert
                        tone={messageTone}
                        title="Availability Update"
                        message={message}
                    />
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-6">
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-text mb-4">Add Schedule Slot</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AuthSelect
                                    id="day_of_week"
                                    value={form.day_of_week}
                                    onChange={val => setForm(f => ({ ...f, day_of_week: val }))}
                                    label="Day of Week"
                                    options={dayOptions}
                                    error={errors.day_of_week?.[0]}
                                />
                                
                                <AuthInput
                                    id="start_time"
                                    value={form.start_time}
                                    onChange={val => setForm(f => ({ ...f, start_time: val }))}
                                    type="time"
                                    label="Start Time"
                                    required
                                    error={errors.start_time?.[0]}
                                />
                                
                                <AuthInput
                                    id="end_time"
                                    value={form.end_time}
                                    onChange={val => setForm(f => ({ ...f, end_time: val }))}
                                    type="time"
                                    label="End Time"
                                    required
                                    error={errors.end_time?.[0]}
                                />

                                <div className="pt-2">
                                    <button type="submit" className="btn-primary w-full" disabled={processing}>
                                        {processing ? 'Adding...' : 'Add Slot'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-text mb-4">Current Schedule</h2>
                            <div className="table-wrap">
                                <table className="table-standard">
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>Time Slot</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!caregiver.availabilities || caregiver.availabilities.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="table-empty">No schedule slots configured yet.</td>
                                            </tr>
                                        ) : (
                                            caregiver.availabilities.map(slot => (
                                                <tr key={slot.id}>
                                                    <td className="font-medium text-text capitalize">{slot.day_of_week}</td>
                                                    <td>{slot.start_time} - {slot.end_time}</td>
                                                    <td>
                                                        <span className="status-indicator status-active">Available</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Availability.layout = page => <AdminLayout>{page}</AdminLayout>;
