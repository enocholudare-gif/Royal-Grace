import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import ClientLayout from '../../../Layouts/ClientLayout';

// Initialize Stripe outside of component to avoid recreating it
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ bookingId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        const { error: submitError, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (submitError) {
            setError(submitError.message);
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Confirm to backend
            try {
                await axios.post('/api/payments/confirm', {
                    payment_intent_id: paymentIntent.id,
                    booking_id: bookingId,
                });
                
                // Redirect on success
                router.visit('/client/bookings', {
                    onSuccess: () => {
                        // Optionally show a flash message here
                    }
                });
            } catch (err) {
                setError('Failed to confirm payment on the server.');
                setProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            
            <button 
                disabled={!stripe || processing} 
                type="submit" 
                className="btn-primary w-full flex justify-center py-3"
            >
                {processing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

export default function Pay({ booking }) {
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        axios.post('/api/payments/intent', { booking_id: booking.id })
            .then((res) => {
                setClientSecret(res.data.clientSecret);
            })
            .catch((err) => {
                setError('Failed to initialize payment. Please try again later.');
            });
    }, [booking.id]);

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
        },
    };

    return (
        <>
            <Head title={`Pay for Booking ${booking.booking_number}`} />
            
            <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-slate-200">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Complete Your Booking</h2>
                            <p className="mt-2 text-slate-600">Booking: {booking.booking_number}</p>
                            <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                                ${Number(booking.total_amount).toFixed(2)}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">{booking.service?.name}</p>
                        </div>

                        {error ? (
                            <div className="bg-red-50 text-red-700 p-4 rounded-md">
                                {error}
                            </div>
                        ) : (
                            clientSecret && (
                                <Elements stripe={stripePromise} options={options}>
                                    <CheckoutForm bookingId={booking.id} />
                                </Elements>
                            )
                        )}
                        
                        {!clientSecret && !error && (
                            <div className="flex justify-center items-center h-32 text-slate-500">
                                Loading payment details...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Pay.layout = page => <ClientLayout title="Payment" description="Securely pay for your booking.">{page}</ClientLayout>;
