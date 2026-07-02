import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { HeartPulse, Stethoscope, ShieldCheck, Clock, Users, Activity } from 'lucide-react';

export default function Landing() {
    const { auth } = usePage().props;
    return (
        <>
            <Head title="Royal Grace Care Services" />
            {/* Sticky Navigation */}
            <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <a href="/" className="text-2xl font-bold text-brand-600">Royal Grace</a>
                        <nav className="hidden md:flex space-x-6">
                            <a href="#home" className="text-gray-700 hover:text-brand-600">Home</a>
                            <a href="#services" className="text-gray-700 hover:text-brand-600">Services</a>
                            <a href="#about" className="text-gray-700 hover:text-brand-600">About</a>
                            <a href="#contact" className="text-gray-700 hover:text-brand-600">Contact</a>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 transition">Login</Link>
                        <Link href="/register" className="px-4 py-2 rounded-md text-sm font-medium border border-brand-600 text-brand-600 hover:bg-brand-50 transition">Create Account</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section id="home" className="pt-24 bg-gradient-to-br from-brand-50 to-white min-h-screen flex items-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                        Premium Healthcare, Powered by Compassion
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Seamless care coordination for families, caregivers, and providers.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="#services" className="px-6 py-3 rounded-md bg-brand-600 text-white font-medium hover:bg-brand-700 transition">
                            Explore Services
                        </a>
                        <a href="#contact" className="px-6 py-3 rounded-md border border-brand-600 text-brand-600 font-medium hover:bg-brand-50 transition">
                            Get Started
                        </a>
                    </div>
                    <div className="mt-12 flex justify-center">
                        <img 
                            src="/images/hero.png" 
                            alt="Compassionate Healthcare" 
                            className="w-full max-w-2xl rounded-2xl shadow-2xl border-4 border-white object-cover" 
                        />
                    </div>
                </div>
            </section>

            {/* Trust Statistics */}
            <section className="bg-white py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <p className="text-3xl font-bold text-brand-600">12k+</p>
                        <p className="text-gray-600">Happy Clients</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-brand-600">3k+</p>
                        <p className="text-gray-600">Caregivers</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-brand-600">45k+</p>
                        <p className="text-gray-600">Visits Completed</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-brand-600">10+</p>
                        <p className="text-gray-600">Years of Experience</p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">Our Services</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            { title: 'Home Care', icon: HeartPulse, desc: 'Compassionate assistance with daily living activities directly in your home.' },
                            { title: 'Nursing Services', icon: Stethoscope, desc: 'Skilled nursing care from certified professionals for optimal recovery.' },
                            { title: 'Secure Coordination', icon: ShieldCheck, desc: 'Safe, secure, and HIPAA-compliant communication among all caregivers.' },
                            { title: '24/7 Support', icon: Clock, desc: 'Round-the-clock assistance and monitoring to ensure peace of mind.' },
                            { title: 'Family Integration', icon: Users, desc: 'Keeping family members informed and involved in every step of the care journey.' },
                            { title: 'Vitals Tracking', icon: Activity, desc: 'Continuous monitoring of patient vitals and health metrics over time.' }
                        ].map((service, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-lg hover:-translate-y-1 transition duration-300">
                                <div className="h-16 w-16 mx-auto mb-6 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                                    <service.icon size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                                <p className="text-gray-600 text-base leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">About Us</h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            At Royal Grace Care Services, we are dedicated to providing premium healthcare powered by compassion. Our team of experienced professionals ensures seamless care coordination for families, caregivers, and providers.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            We believe that every individual deserves the highest standard of care, delivered with respect, dignity, and a personal touch.
                        </p>
                    </div>
                    <div>
                        <img 
                            src="/images/about.png" 
                            alt="Our Healthcare Team" 
                            className="w-full rounded-2xl shadow-xl object-cover" 
                        />
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-gray-50 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Contact Us</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Ready to get started? Reach out to us today and let us help you with your healthcare needs.
                    </p>
                    <a href="mailto:contact@royalgrace.example.com" className="px-6 py-3 rounded-md bg-brand-600 text-white font-medium hover:bg-brand-700 transition">
                        Email Us
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="mb-4">© {new Date().getFullYear()} Royal Grace Care Services. All rights reserved.</p>
                    <div className="flex justify-center space-x-4">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Contact</a>
                    </div>
                </div>
            </footer>
        </>
    );
}

// Removed unused GuestLayout layout mapping to allow full-width landing page.
