import React from 'react';
import AppLogo from '../Components/Layout/AppLogo';

export default function GuestLayout({ children, title = 'Welcome', subtitle = 'Compassionate healthcare coordination for every family.' }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 to-surface-muted">
            <div className="container-page flex min-h-screen flex-col justify-center py-10">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <section className="hidden rounded-[2rem] bg-brand-900 p-10 text-white shadow-lg lg:block">
                            {/* Real logo — on dark navy background */}
                            <AppLogo dark={true} size="lg" />

                            <div className="mt-10 max-w-xl space-y-5">
                                <h1 className="text-4xl font-semibold text-white">{title}</h1>
                                <p className="text-base leading-7 text-brand-100">
                                    {subtitle}
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl bg-white/10 p-5">
                                    <p className="text-sm font-semibold">Coordinated Bookings</p>
                                    <p className="mt-2 text-sm text-brand-100">Streamlined service requests, confirmations, and visit history.</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-5">
                                    <p className="text-sm font-semibold">Family Visibility</p>
                                    <p className="mt-2 text-sm text-brand-100">Real-time care updates, reports, invoices, and communication.</p>
                                </div>
                            </div>
                        </section>

                        <section className="mx-auto w-full max-w-xl rounded-[2rem] border border-border bg-surface p-6 shadow-lg sm:p-8">
                            <div className="mb-6 lg:hidden">
                                {/* Mobile logo — on white card background */}
                                <AppLogo dark={false} size="sm" />
                                <h1 className="text-3xl font-semibold text-text">{title}</h1>
                                <p className="mt-2 text-sm text-text-muted">{subtitle}</p>
                            </div>

                            {children}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
