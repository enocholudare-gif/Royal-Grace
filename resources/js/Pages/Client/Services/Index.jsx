import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import ClientLayout from '../../../Layouts/ClientLayout';

export default function Index({ services }) {
    const [selectedService, setSelectedService] = useState(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        service_id: '',
        notes: ''
    });

    const openInquiryModal = (service) => {
        setSelectedService(service);
        setData('service_id', service.id);
    };

    const closeInquiryModal = () => {
        setSelectedService(null);
        reset();
    };

    const submitInquiry = (e) => {
        e.preventDefault();
        post('/client/services/request', {
            onSuccess: () => {
                closeInquiryModal();
                alert('Your service inquiry has been submitted! A member of our team will contact you shortly.');
            }
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(price);
    };

    return (
        <>
            <Head title="Care Plans & Services" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text">Care Plans & Services</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Explore our available care plans and request a new service for your personalized care journey.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services && services.length > 0 ? services.map(service => (
                        <div key={service.id} className="card p-6 flex flex-col">
                            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-text">{service.name}</h3>
                            <p className="mt-2 text-sm text-text-muted flex-grow">
                                {service.description || 'Professional care service tailored to your needs.'}
                            </p>
                            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                                <div>
                                    <p className="font-semibold text-text">{formatPrice(service.price)}</p>
                                    <p className="text-xs text-text-muted">per {service.duration_minutes} mins</p>
                                </div>
                                <button 
                                    onClick={() => openInquiryModal(service)}
                                    className="btn-primary text-sm px-4 py-2"
                                >
                                    Request Service
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full card p-10 text-center text-text-muted">
                            No services are currently available. Please contact support.
                        </div>
                    )}
                </div>
            </div>

            {/* Inquiry Modal */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="card w-full max-w-md p-6 bg-surface shadow-xl relative animate-scale-in">
                        <button 
                            onClick={closeInquiryModal}
                            className="absolute top-4 right-4 text-text-muted hover:text-text"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        
                        <h2 className="text-lg font-bold text-text mb-1">Request Service</h2>
                        <p className="text-sm text-text-muted mb-6">
                            You are inquiring about <strong>{selectedService.name}</strong>.
                        </p>
                        
                        <form onSubmit={submitInquiry} className="space-y-4">
                            <div>
                                <label className="form-label">Additional Notes or Questions (Optional)</label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    rows="4"
                                    className="input-field w-full"
                                    placeholder="Tell us any specific requirements or ask a question about this service..."
                                />
                                {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                            </div>
                            
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={closeInquiryModal} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="btn-primary">
                                    {processing ? 'Submitting...' : 'Submit Inquiry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = page => <ClientLayout title="Care Plans" description="Review your customized care plans and services.">{page}</ClientLayout>;
