import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { CheckCircle, Clock, CreditCard, X, Calendar, ChevronRight, Star, ShieldCheck } from 'lucide-react';

const serviceIcons = [
    { bg: 'bg-rose-50', text: 'text-rose-500', icon: '🏠' },
    { bg: 'bg-blue-50',  text: 'text-blue-500',  icon: '💊' },
    { bg: 'bg-green-50', text: 'text-green-500', icon: '🫀' },
    { bg: 'bg-amber-50', text: 'text-amber-500', icon: '🧠' },
    { bg: 'bg-purple-50',text: 'text-purple-500',icon: '🦽' },
    { bg: 'bg-teal-50',  text: 'text-teal-500',  icon: '🩺' },
];

function formatPrice(price) {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price);
}

function formatDuration(mins) {
    if (!mins) return '60 min session';
    if (mins < 60) return `${mins} min session`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}min session` : `${h}hr session`;
}

export default function Index({ services = [], auth }) {
    const [selectedService, setSelectedService] = useState(null);
    const [step, setStep] = useState(1); // 1 = select service, 2 = schedule & confirm

    const { data, setData, post, processing, errors, reset } = useForm({
        service_id: '',
        scheduled_start_at: '',
        care_instructions: '',
    });

    const openBooking = (service) => {
        setSelectedService(service);
        setData('service_id', service.id);
        setStep(1);
    };

    const closeModal = () => {
        setSelectedService(null);
        reset();
        setStep(1);
    };

    const goToSchedule = () => setStep(2);

    const submitBooking = (e) => {
        e.preventDefault();
        post('/client/bookings', {
            onError: () => {} // stays on page, shows errors
        });
    };

    // Minimum datetime = now + 2 hours
    const minDatetime = new Date(Date.now() + 2 * 3600 * 1000)
        .toISOString().slice(0, 16);

    return (
        <>
            <Head title="Book a Service" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Our Care Services</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Select a service, choose your schedule, and complete your booking instantly.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-muted bg-surface border border-border rounded-lg px-4 py-2">
                        <ShieldCheck size={16} className="text-green-500" />
                        Secure bank transfer payment
                    </div>
                </div>

                {/* How it works */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { step: '1', label: 'Choose a service', icon: <Star size={18} /> },
                        { step: '2', label: 'Pick date & time', icon: <Calendar size={18} /> },
                        { step: '3', label: 'Pay & confirm', icon: <CreditCard size={18} /> },
                    ].map((s) => (
                        <div key={s.step} className="card p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                                {s.step}
                            </div>
                            <span className="text-sm font-medium text-text">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Services Grid */}
                {services.length === 0 ? (
                    <div className="card p-12 text-center text-text-muted">
                        <p className="text-lg font-semibold mb-2">No services available right now</p>
                        <p className="text-sm">Please check back later or contact us directly.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, i) => {
                            const theme = serviceIcons[i % serviceIcons.length];
                            return (
                                <div key={service.id} className="card p-0 flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                                    {/* Card top accent */}
                                    <div className={`h-1.5 w-full ${theme.bg.replace('bg-', 'bg-').replace('-50', '-400')}`} />

                                    <div className="p-6 flex flex-col flex-grow">
                                        {/* Icon & Name */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-12 h-12 ${theme.bg} rounded-xl flex items-center justify-center text-2xl shrink-0`}>
                                                {theme.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-text leading-tight">{service.name}</h3>
                                                <span className="inline-flex items-center gap-1 text-xs text-text-muted mt-1">
                                                    <Clock size={11} /> {formatDuration(service.duration_minutes)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-text-muted flex-grow leading-relaxed">
                                            {service.description || 'Professional, compassionate care delivered by our trained team.'}
                                        </p>

                                        {/* Price & CTA */}
                                        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                                            <div>
                                                <p className="text-xl font-bold text-text">{formatPrice(service.price)}</p>
                                                <p className="text-xs text-text-muted">per session</p>
                                            </div>
                                            <button
                                                onClick={() => openBooking(service)}
                                                className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
                                            >
                                                Book Now <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* === BOOKING MODAL === */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="card w-full max-w-lg bg-surface shadow-2xl relative animate-scale-in overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                            <button onClick={closeModal} className="absolute top-4 right-4 text-white/70 hover:text-white transition">
                                <X size={20} />
                            </button>
                            <h2 className="text-lg font-bold">{selectedService.name}</h2>
                            <p className="text-white/80 text-sm mt-1">{formatDuration(selectedService.duration_minutes)}</p>
                            <div className="mt-3 flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold">{formatPrice(selectedService.price)}</span>
                                <span className="text-white/70 text-sm">per session</span>
                            </div>
                        </div>

                        <div className="p-6">
                            {step === 1 && (
                                /* Step 1: Service overview + notes */
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                        <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                                        <div className="text-sm text-green-800">
                                            <p className="font-semibold">What's included</p>
                                            <p className="mt-0.5 text-green-700">
                                                {selectedService.description || 'Professional care service tailored to your specific needs, delivered by our qualified caregivers.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label">Special instructions or needs <span className="text-text-muted font-normal">(optional)</span></label>
                                        <textarea
                                            value={data.care_instructions}
                                            onChange={e => setData('care_instructions', e.target.value)}
                                            rows={3}
                                            className="input-field w-full mt-1"
                                            placeholder="E.g. mobility aids needed, specific routines, allergies..."
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                                            Cancel
                                        </button>
                                        <button type="button" onClick={goToSchedule} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                            Next: Choose Date <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                /* Step 2: Schedule + Confirm + Pay */
                                <form onSubmit={submitBooking} className="space-y-4">
                                    <div>
                                        <label className="form-label">Preferred Date & Time <span className="text-red-500">*</span></label>
                                        <input
                                            type="datetime-local"
                                            min={minDatetime}
                                            value={data.scheduled_start_at}
                                            onChange={e => setData('scheduled_start_at', e.target.value)}
                                            className="input-field w-full mt-1"
                                            required
                                        />
                                        {errors.scheduled_start_at && (
                                            <p className="text-red-500 text-xs mt-1">{errors.scheduled_start_at}</p>
                                        )}
                                        <p className="text-xs text-text-muted mt-1">Session lasts {formatDuration(selectedService.duration_minutes)}</p>
                                    </div>

                                    {/* Order summary */}
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm border border-border">
                                        <div className="flex justify-between text-text-muted">
                                            <span>{selectedService.name}</span>
                                            <span>{formatPrice(selectedService.price)}</span>
                                        </div>
                                        <div className="flex justify-between text-text-muted">
                                            <span>Tax</span>
                                            <span>£0.00</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-text border-t border-border pt-2">
                                            <span>Total Due</span>
                                            <span>{formatPrice(selectedService.price)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <CreditCard size={13} />
                                        After booking, you'll be taken to our secure bank transfer payment page.
                                    </div>

                                    {errors.error && (
                                        <p className="text-red-500 text-sm bg-red-50 rounded p-2">{errors.error}</p>
                                    )}

                                    <div className="flex gap-3 pt-1">
                                        <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                                            Back
                                        </button>
                                        <button type="submit" disabled={processing} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                            {processing ? 'Creating Booking...' : (
                                                <>Confirm & Pay <CreditCard size={16} /></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = page => (
    <ClientLayout title="Book a Service" description="Choose a care service and complete your booking.">
        {page}
    </ClientLayout>
);
