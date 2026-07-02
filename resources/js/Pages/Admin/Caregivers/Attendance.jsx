import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AuthAlert from '../../../Components/Auth/AuthAlert';
import AuthInput from '../../../Components/Auth/AuthInput';
import AuthSelect from '../../../Components/Auth/AuthSelect';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Attendance({ caregiver }) {
    const today = new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        attendance_date: today,
        status: 'present',
        clock_in_at: '',
        clock_out_at: '',
        hours_worked: '',
        notes: '',
    });
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageTone, setMessageTone] = useState('');
    const [errors, setErrors] = useState({});

    const statusOptions = [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'present', label: 'Present' },
        { value: 'late', label: 'Late' },
        { value: 'absent', label: 'Absent' },
        { value: 'excused', label: 'Excused' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setMessage('');

        try {
            await axios.post(`/caregivers/${caregiver.id}/attendance`, form);
            setMessage('Attendance record added successfully.');
            setMessageTone('success');
            
            // Reset specific fields
            setForm(f => ({
                ...f,
                clock_in_at: '',
                clock_out_at: '',
                hours_worked: '',
                notes: '',
            }));

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '—';
        return new Date(dateTimeString).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Caregiver Attendance" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href={`/admin/caregivers/${caregiver.id}`} className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to {caregiver.first_name}
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Attendance Tracking</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Record and view attendance history for {caregiver.first_name} {caregiver.last_name}.
                        </p>
                    </div>
                </div>

                {message && (
                    <AuthAlert
                        tone={messageTone}
                        title="Attendance Update"
                        message={message}
                    />
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-6">
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-text mb-4">Add Record</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AuthInput
                                    id="attendance_date"
                                    value={form.attendance_date}
                                    onChange={val => setForm(f => ({ ...f, attendance_date: val }))}
                                    type="date"
                                    label="Date"
                                    required
                                    error={errors.attendance_date?.[0]}
                                />
                                
                                <AuthSelect
                                    id="status"
                                    value={form.status}
                                    onChange={val => setForm(f => ({ ...f, status: val }))}
                                    label="Status"
                                    options={statusOptions}
                                    error={errors.status?.[0]}
                                />

                                <AuthInput
                                    id="clock_in_at"
                                    value={form.clock_in_at}
                                    onChange={val => setForm(f => ({ ...f, clock_in_at: val }))}
                                    type="datetime-local"
                                    label="Clock In Time (Optional)"
                                    error={errors.clock_in_at?.[0]}
                                />
                                
                                <AuthInput
                                    id="clock_out_at"
                                    value={form.clock_out_at}
                                    onChange={val => setForm(f => ({ ...f, clock_out_at: val }))}
                                    type="datetime-local"
                                    label="Clock Out Time (Optional)"
                                    error={errors.clock_out_at?.[0]}
                                />

                                <AuthInput
                                    id="hours_worked"
                                    value={form.hours_worked}
                                    onChange={val => setForm(f => ({ ...f, hours_worked: val }))}
                                    type="number"
                                    step="0.1"
                                    label="Hours Worked (Optional)"
                                    error={errors.hours_worked?.[0]}
                                />

                                <div className="form-group">
                                    <label className="form-label" htmlFor="att-notes">Notes (Optional)</label>
                                    <textarea
                                        id="att-notes"
                                        value={form.notes}
                                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                        className={`form-textarea min-h-[80px] ${errors.notes ? 'border-danger-300 focus:border-danger-500' : ''}`}
                                        placeholder="Reason for absence, late arrival, etc."
                                    ></textarea>
                                    {errors.notes?.[0] && <p className="form-error mt-1">{errors.notes[0]}</p>}
                                </div>

                                <div className="pt-2">
                                    <button type="submit" className="btn-primary w-full" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Record'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-text mb-4">Attendance History</h2>
                            <div className="table-wrap">
                                <table className="table-standard">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Clock In</th>
                                            <th>Clock Out</th>
                                            <th>Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!caregiver.attendanceRecords || caregiver.attendanceRecords.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="table-empty">No attendance records found.</td>
                                            </tr>
                                        ) : (
                                            caregiver.attendanceRecords.map(record => (
                                                <tr key={record.id}>
                                                    <td className="font-medium text-text">{formatDate(record.attendance_date)}</td>
                                                    <td>
                                                        <span className={`status-indicator ${
                                                            record.status === 'present' ? 'status-active' :
                                                            record.status === 'late' ? 'status-warning' :
                                                            record.status === 'absent' ? 'status-danger' :
                                                            record.status === 'scheduled' ? 'status-info' :
                                                            'status-pending'
                                                        }`}>
                                                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="text-text-muted">{formatDateTime(record.clock_in_at)}</td>
                                                    <td className="text-text-muted">{formatDateTime(record.clock_out_at)}</td>
                                                    <td className="text-text-muted">{record.hours_worked ? record.hours_worked + ' hrs' : '—'}</td>
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

Attendance.layout = page => <AdminLayout>{page}</AdminLayout>;
