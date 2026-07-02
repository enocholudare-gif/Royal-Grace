import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthCard from '../../Components/Auth/AuthCard';
import AuthAlert from '../../Components/Auth/AuthAlert';
import AuthInput from '../../Components/Auth/AuthInput';
import AuthPasswordInput from '../../Components/Auth/AuthPasswordInput';
import AuthSelect from '../../Components/Auth/AuthSelect';
import GuestLayout from '../../Layouts/GuestLayout';

export default function Register() {
    const roleOptions = [
        { value: 'client', label: 'Client' },
        { value: 'family-member', label: 'Family Member' },
        { value: 'caregiver', label: 'Caregiver' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: '',
        device_name: 'web',
        client: {
            date_of_birth: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'Canada',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            care_notes: '',
            mobility_notes: '',
            medical_notes: '',
        },
        family_member: {
            client_id: '',
            relationship_type: '',
            can_view_bookings: true,
            can_view_reports: true,
            can_view_invoices: true,
            can_receive_notifications: true,
        },
        caregiver: {
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'Canada',
            certifications: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            bio: '',
        },
    });

    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        const payload = structuredClone(data);
        if (payload.caregiver?.certifications && typeof payload.caregiver.certifications === 'string') {
            payload.caregiver.certifications = payload.caregiver.certifications
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        } else {
            payload.caregiver.certifications = [];
        }

        if (payload.family_member?.client_id === '') {
            payload.family_member.client_id = null;
        }

        // We can just use the standard inertia post, which handles tokens if configured.
        post('/register', {
            onSuccess: (page) => {
                const token = page.props?.token;
                if (token) {
                    localStorage.setItem('auth_token', token);
                    window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                localStorage.setItem('auth_flash_success', page.props?.flash?.success || 'Registration successful.');
            },
            onError: (errs) => {
                setMessage('Please correct the highlighted fields and try again.');
            }
        });
    };

    return (
        <GuestLayout
            title="Create your account"
            subtitle="Join Royal Grace to access coordinated care, family visibility, and secure communication."
        >
            <Head title="Register" />

            <AuthCard
                title="Create your account"
                subtitle="Join Royal Grace to access coordinated care, family visibility, and secure communication."
            >
                {message && (
                    <AuthAlert
                        tone="danger"
                        title="Registration update"
                        message={message}
                    />
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-5 md:grid-cols-2">
                        <AuthInput
                            id="register-first-name"
                            value={data.first_name}
                            onChange={val => setData('first_name', val)}
                            label="First name"
                            placeholder="John"
                            autocomplete="given-name"
                            required
                            error={errors.first_name}
                        />

                        <AuthInput
                            id="register-last-name"
                            value={data.last_name}
                            onChange={val => setData('last_name', val)}
                            label="Last name"
                            placeholder="Doe"
                            autocomplete="family-name"
                            required
                            error={errors.last_name}
                        />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <AuthInput
                            id="register-email"
                            value={data.email}
                            onChange={val => setData('email', val)}
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            autocomplete="email"
                            required
                            error={errors.email}
                        />

                        <AuthInput
                            id="register-phone"
                            value={data.phone}
                            onChange={val => setData('phone', val)}
                            label="Phone number"
                            type="tel"
                            placeholder="+1..."
                            autocomplete="tel"
                            error={errors.phone}
                        />
                    </div>

                    <AuthSelect
                        id="register-role"
                        value={data.role}
                        onChange={val => setData('role', val)}
                        label="Account type"
                        options={roleOptions}
                        required
                        error={errors.role}
                    />

                    <div className="grid gap-5 md:grid-cols-2">
                        <AuthPasswordInput
                            id="register-password"
                            value={data.password}
                            onChange={val => setData('password', val)}
                            label="Password"
                            placeholder="Create a strong password"
                            autocomplete="new-password"
                            required
                            help="Minimum 8 characters."
                            error={errors.password}
                        />

                        <AuthPasswordInput
                            id="register-password-confirmation"
                            value={data.password_confirmation}
                            onChange={val => setData('password_confirmation', val)}
                            label="Confirm password"
                            placeholder="Repeat your password"
                            autocomplete="new-password"
                            required
                            error={errors.password_confirmation}
                        />
                    </div>

                    {data.role === 'client' && (
                        <div className="pt-4 border-t border-border space-y-5">
                            <div>
                                <h3 className="text-lg font-semibold text-text">Client profile</h3>
                                <p className="text-sm text-text-muted">Tell us about the care recipient so bookings and care coordination can start smoothly.</p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <AuthInput
                                    id="client-date-of-birth"
                                    value={data.client.date_of_birth}
                                    onChange={val => setData('client', { ...data.client, date_of_birth: val })}
                                    label="Date of birth"
                                    type="date"
                                    error={errors['client.date_of_birth']}
                                />

                                <AuthInput
                                    id="client-emergency-contact-name"
                                    value={data.client.emergency_contact_name}
                                    onChange={val => setData('client', { ...data.client, emergency_contact_name: val })}
                                    label="Emergency contact name"
                                    placeholder="Primary emergency contact"
                                    error={errors['client.emergency_contact_name']}
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <AuthInput
                                    id="client-address-line-1"
                                    value={data.client.address_line_1}
                                    onChange={val => setData('client', { ...data.client, address_line_1: val })}
                                    label="Address line 1"
                                    required
                                    error={errors['client.address_line_1']}
                                />

                                <AuthInput
                                    id="client-address-line-2"
                                    value={data.client.address_line_2}
                                    onChange={val => setData('client', { ...data.client, address_line_2: val })}
                                    label="Address line 2"
                                    error={errors['client.address_line_2']}
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                <AuthInput id="client-city" value={data.client.city} onChange={val => setData('client', { ...data.client, city: val })} label="City" required error={errors['client.city']} />
                                <AuthInput id="client-state" value={data.client.state} onChange={val => setData('client', { ...data.client, state: val })} label="Province/State" required error={errors['client.state']} />
                                <AuthInput id="client-postal-code" value={data.client.postal_code} onChange={val => setData('client', { ...data.client, postal_code: val })} label="Postal code" required error={errors['client.postal_code']} />
                                <AuthInput id="client-country" value={data.client.country} onChange={val => setData('client', { ...data.client, country: val })} label="Country" required error={errors['client.country']} />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <AuthInput
                                    id="client-emergency-contact-phone"
                                    value={data.client.emergency_contact_phone}
                                    onChange={val => setData('client', { ...data.client, emergency_contact_phone: val })}
                                    label="Emergency contact phone"
                                    error={errors['client.emergency_contact_phone']}
                                />

                                <AuthInput
                                    id="client-care-notes"
                                    value={data.client.care_notes}
                                    onChange={val => setData('client', { ...data.client, care_notes: val })}
                                    label="Care notes"
                                    placeholder="Brief care requirements"
                                    error={errors['client.care_notes']}
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <AuthInput
                                    id="client-mobility-notes"
                                    value={data.client.mobility_notes}
                                    onChange={val => setData('client', { ...data.client, mobility_notes: val })}
                                    label="Mobility notes"
                                    error={errors['client.mobility_notes']}
                                />

                                <AuthInput
                                    id="client-medical-notes"
                                    value={data.client.medical_notes}
                                    onChange={val => setData('client', { ...data.client, medical_notes: val })}
                                    label="Medical notes"
                                    error={errors['client.medical_notes']}
                                />
                            </div>
                        </div>
                    )}

                    {data.role === 'family-member' && (
                        <div className="pt-4 border-t border-border space-y-5">
                            <div>
                                <h3 className="text-lg font-semibold text-text">Family access details</h3>
                                <p className="text-sm text-text-muted">Link this account to an existing client record and define the visibility level.</p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <AuthInput
                                    id="family-client-id"
                                    value={data.family_member.client_id}
                                    onChange={val => setData('family_member', { ...data.family_member, client_id: val })}
                                    label="Client ID"
                                    type="number"
                                    required
                                    help="Use the client ID provided by an admin."
                                    error={errors['family_member.client_id']}
                                />

                                <AuthInput
                                    id="family-relationship-type"
                                    value={data.family_member.relationship_type}
                                    onChange={val => setData('family_member', { ...data.family_member, relationship_type: val })}
                                    label="Relationship"
                                    placeholder="Son, Daughter, Spouse..."
                                    required
                                    error={errors['family_member.relationship_type']}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.family_member.can_view_bookings} onChange={e => setData('family_member', { ...data.family_member, can_view_bookings: e.target.checked })} />
                                    <span className="text-sm text-text">Can view bookings</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.family_member.can_view_reports} onChange={e => setData('family_member', { ...data.family_member, can_view_reports: e.target.checked })} />
                                    <span className="text-sm text-text">Can view reports</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.family_member.can_view_invoices} onChange={e => setData('family_member', { ...data.family_member, can_view_invoices: e.target.checked })} />
                                    <span className="text-sm text-text">Can view invoices</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.family_member.can_receive_notifications} onChange={e => setData('family_member', { ...data.family_member, can_receive_notifications: e.target.checked })} />
                                    <span className="text-sm text-text">Can receive notifications</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {data.role === 'caregiver' && (
                        <div className="pt-4 border-t border-border space-y-5">
                            <div>
                                <h3 className="text-lg font-semibold text-text">Caregiver profile</h3>
                                <p className="text-sm text-text-muted">Add profile and compliance details needed for caregiver onboarding.</p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <AuthInput
                                    id="caregiver-address-line-1"
                                    value={data.caregiver.address_line_1}
                                    onChange={val => setData('caregiver', { ...data.caregiver, address_line_1: val })}
                                    label="Address line 1"
                                    required
                                    error={errors['caregiver.address_line_1']}
                                />

                                <AuthInput
                                    id="caregiver-address-line-2"
                                    value={data.caregiver.address_line_2}
                                    onChange={val => setData('caregiver', { ...data.caregiver, address_line_2: val })}
                                    label="Address line 2"
                                    error={errors['caregiver.address_line_2']}
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                <AuthInput id="caregiver-city" value={data.caregiver.city} onChange={val => setData('caregiver', { ...data.caregiver, city: val })} label="City" required error={errors['caregiver.city']} />
                                <AuthInput id="caregiver-state" value={data.caregiver.state} onChange={val => setData('caregiver', { ...data.caregiver, state: val })} label="Province/State" required error={errors['caregiver.state']} />
                                <AuthInput id="caregiver-postal-code" value={data.caregiver.postal_code} onChange={val => setData('caregiver', { ...data.caregiver, postal_code: val })} label="Postal code" required error={errors['caregiver.postal_code']} />
                                <AuthInput id="caregiver-country" value={data.caregiver.country} onChange={val => setData('caregiver', { ...data.caregiver, country: val })} label="Country" required error={errors['caregiver.country']} />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <AuthInput
                                    id="caregiver-emergency-contact-name"
                                    value={data.caregiver.emergency_contact_name}
                                    onChange={val => setData('caregiver', { ...data.caregiver, emergency_contact_name: val })}
                                    label="Emergency contact name"
                                    required
                                    error={errors['caregiver.emergency_contact_name']}
                                />

                                <AuthInput
                                    id="caregiver-emergency-contact-phone"
                                    value={data.caregiver.emergency_contact_phone}
                                    onChange={val => setData('caregiver', { ...data.caregiver, emergency_contact_phone: val })}
                                    label="Emergency contact phone"
                                    required
                                    error={errors['caregiver.emergency_contact_phone']}
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <AuthInput
                                    id="caregiver-certifications"
                                    value={data.caregiver.certifications}
                                    onChange={val => setData('caregiver', { ...data.caregiver, certifications: val })}
                                    label="Certifications"
                                    placeholder="CPR, Geriatric Care, First Aid"
                                    help="Separate multiple certifications with commas."
                                    error={errors['caregiver.certifications']}
                                />

                                <AuthInput
                                    id="caregiver-bio"
                                    value={data.caregiver.bio}
                                    onChange={val => setData('caregiver', { ...data.caregiver, bio: val })}
                                    label="Short bio"
                                    placeholder="Experience, specialties, and care approach"
                                    error={errors['caregiver.bio']}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4">
                        <Link href="/login" className="btn-link">
                            Already have an account?
                        </Link>

                        <button type="submit" className="btn-primary" disabled={processing}>
                            {processing ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    );
}
