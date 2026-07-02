import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CaregiverLayout from '../../../Layouts/CaregiverLayout';

export default function CheckOut({ booking, visitReport }) {
    const { data, setData, post, processing, errors } = useForm({
        latitude: '',
        longitude: '',
        device_info: navigator.userAgent || 'Unknown Device'
    });

    const [locationStatus, setLocationStatus] = useState('pending');
    const [locationError, setLocationError] = useState('');

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = () => {
        setLocationStatus('fetching');
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationStatus('error');
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setData(data => ({
                    ...data,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setLocationStatus('success');
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationStatus('error');
                setLocationError('Unable to retrieve your location. Please ensure location services are enabled.');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const submit = (e) => {
        e.preventDefault();
        if (locationStatus !== 'success') {
            alert('Please allow location access before checking out.');
            return;
        }
        post(`/caregiver/visits/${booking.id}/check-out`);
    };

    return (
        <>
            <Head title="Visit Check-Out" />
            
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/caregiver/visits/${booking.id}/active`} className="text-sm font-medium text-text-muted hover:text-brand-600 transition-colors">
                        &larr; Back to Active Dashboard
                    </Link>
                </div>

                <div className="card p-8 text-center border-t-4 border-rose-500">
                    <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </div>

                    <h1 className="text-2xl font-bold text-text mb-2">Check-out of Client Location</h1>
                    <p className="text-text-muted mb-8">
                        You are about to end your visit with <span className="font-bold text-text">{booking.client?.user?.first_name} {booking.client?.user?.last_name}</span>. 
                        Your departure location will be recorded.
                    </p>

                    {locationStatus === 'fetching' && (
                        <div className="p-4 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center gap-3 mb-6 animate-pulse">
                            <svg className="animate-spin h-5 w-5 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span className="font-medium">Acquiring GPS location...</span>
                        </div>
                    )}

                    {locationStatus === 'success' && (
                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center gap-3 mb-6 border border-emerald-200">
                            <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            <span className="font-medium">Location verified successfully!</span>
                        </div>
                    )}

                    {locationStatus === 'error' && (
                        <div className="p-4 bg-rose-50 text-rose-700 rounded-lg text-left mb-6 border border-rose-200">
                            <div className="flex gap-3">
                                <svg className="h-6 w-6 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div>
                                    <h3 className="font-bold">Location Error</h3>
                                    <p className="text-sm mt-1">{locationError}</p>
                                    <button onClick={getLocation} className="mt-2 text-sm font-bold text-rose-800 hover:underline">
                                        Try again
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {errors.booking_id && (
                         <div className="p-4 bg-rose-50 text-rose-700 rounded-lg mb-6 border border-rose-200 font-medium">
                            {errors.booking_id}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <button 
                            type="submit" 
                            disabled={processing || locationStatus !== 'success'}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                                locationStatus === 'success' && !processing
                                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md hover:shadow-lg' 
                                    : 'bg-surface-subtle text-text-muted cursor-not-allowed'
                            }`}
                        >
                            {processing ? 'Processing Check-out...' : 'Confirm Check-out & End Visit'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

CheckOut.layout = page => <CaregiverLayout title="Check-out" description="End your visit">{page}</CaregiverLayout>;
