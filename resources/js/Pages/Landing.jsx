import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Heart, Phone, ArrowRight, ShieldCheck, Users, Activity, Home, Car,
    HeartPulse, Menu, X, ChevronRight, ChevronLeft, MapPin,
    Clock, Award, Handshake, UserCheck, CalendarDays, FileText,
    MessageCircle, ChevronDown, Mail, BadgeCheck, Smile,
    Stethoscope, Building2, Globe2
} from 'lucide-react';

const C = {
    navy: '#0A192F',
    navyMid: '#102240',
    gold: '#D4AF37',
    goldLight: '#F0D875',
    sage: '#9DC183',
    sageDark: '#6B9E57',
    light: '#f8f9fa',
    white: '#ffffff'
};

const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } }
};
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
};

function SectionLabel({ text, light = false }) {
    return (
        <div className="inline-flex items-center justify-center gap-2 mb-5">
            <div className="h-px w-8 rounded" style={{ backgroundColor: light ? C.gold : C.sage }} />
            <span className="text-xs font-black uppercase tracking-[0.25em]" style={{ color: light ? C.gold : C.sage }}>
                {text}
            </span>
            <div className="h-px w-8 rounded" style={{ backgroundColor: light ? C.gold : C.sage }} />
        </div>
    );
}

const heroSlides = [
    {
        url: 'https://cdn.phototourl.com/free/2026-07-14-b255f613-a893-4aab-87a5-c1bf137a0daa.jpg',
        caption: 'Companion Care',
        title: 'Companion Care',
        desc: 'Conversation and companionship • Emotional support • Walks and social activities • Friendly wellness check-ins'
    },
    {
        url: 'https://cdn.phototourl.com/free/2026-07-14-7a29c4a8-2bd7-4058-8f46-c95f2b7e0116.jpg',
        caption: 'Daily Living Assistance',
        title: 'Daily Living Assistance',
        desc: 'Assistance with dressing • Personal hygiene support • Routine assistance • Daily activity support'
    },
    {
        url: 'https://cdn.phototourl.com/free/2026-07-14-93c92015-5db5-431c-b3ed-16b32a3e1390.jpg',
        caption: 'Wellness Support Services',
        title: 'Wellness Support Services',
        desc: 'Meal preparation • Hydration reminders • Wellness monitoring • Healthy routine support'
    },
    {
        url: 'https://cdn.phototourl.com/free/2026-07-14-9c8b4267-5651-49eb-bebb-f0e24318a452.jpg',
        caption: 'Transportation Assistance',
        title: 'Transportation Assistance',
        desc: 'Appointment transportation • Grocery shopping assistance • Pharmacy pickups • Community outings'
    },
    {
        url: 'https://cdn.phototourl.com/free/2026-07-14-51cd2603-51bb-4804-af38-737628c12a91.jpg',
        caption: 'Family Relief & Respite Support',
        title: 'Family Relief & Respite Support',
        desc: 'Temporary caregiver relief • Short-term companionship support • Evening and weekend assistance'
    },
    {
        url: 'https://cdn.phototourl.com/free/2026-07-14-5534b45b-26ed-4993-939f-3a3ff6e39927.jpg',
        caption: 'Home Support Services',
        title: 'Home Support Services',
        desc: 'Light housekeeping • Laundry assistance • Home organization • General household support'
    }
];

function HeroCarousel({ current, setCurrent }) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timerRef = useRef(null);

    const goTo = useCallback((index) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrent(index);
        setTimeout(() => setIsTransitioning(false), 700);
    }, [isTransitioning, setCurrent]);

    const next = useCallback(() => {
        goTo((current + 1) % heroSlides.length);
    }, [current, goTo]);

    const prev = useCallback(() => {
        goTo((current - 1 + heroSlides.length) % heroSlides.length);
    }, [current, goTo]);

    useEffect(() => {
        timerRef.current = setInterval(next, 5000);
        return () => clearInterval(timerRef.current);
    }, [next]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {heroSlides.map((slide, i) => (
                <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: i === current ? 1 : 0 }}
                >
                    <img
                        src={slide.url}
                        alt={slide.caption}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,25,47,0.65) 0%, rgba(10,25,47,0.45) 50%, rgba(10,25,47,0.75) 100%)' }} />
                </div>
            ))}

            {/* Arrows */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center border border-white/30 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all"
                aria-label="Previous slide"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center border border-white/30 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all"
                aria-label="Next slide"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                            width: i === current ? '28px' : '8px',
                            height: '8px',
                            backgroundColor: i === current ? '#D4AF37' : 'rgba(255,255,255,0.4)'
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Landing() {
    const { auth } = usePage().props;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [expandedService, setExpandedService] = useState(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 800], [0, 160]);
    const opacity1 = useTransform(scrollY, [0, 400], [1, 0]);

    useEffect(() => {
        const h = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Services', href: '#services' },
        { name: 'About', href: '#about' },
        { name: 'Process', href: '#process' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Contact', href: '#contact' }
    ];

    const services = [
        { title: 'Companion Care', icon: Users, desc: ['Conversation and companionship', 'Emotional support', 'Walks and social activities', 'Friendly wellness check-ins'], color: C.gold },
        { title: 'Daily Living Assistance', icon: Home, desc: ['Assistance with dressing', 'Personal hygiene support', 'Routine assistance', 'Daily activity support'], color: C.gold },
        { title: 'Wellness Support Services', icon: Activity, desc: ['Meal preparation', 'Hydration reminders', 'Wellness monitoring', 'Healthy routine support'], color: C.sage },
        { title: 'Transportation Assistance', icon: Car, desc: ['Appointment transportation', 'Grocery shopping assistance', 'Pharmacy pickups', 'Community outings'], color: C.sage },
        { title: 'Family Relief & Respite Support', icon: HeartPulse, desc: ['Temporary caregiver relief', 'Short-term companionship support', 'Evening and weekend assistance'], color: C.gold },
        { title: 'Home Support Services', icon: ShieldCheck, desc: ['Light housekeeping', 'Laundry assistance', 'Home organization', 'General household support'], color: C.sage }
    ];



    const process = [
        { step: '01', title: 'Free Consultation', icon: Phone, desc: 'Call or message us. We listen carefully to understand your specific situation, needs, and goals — with absolutely no obligation.' },
        { step: '02', title: 'Personalised Care Plan', icon: FileText, desc: 'Our coordinators create a fully tailored care plan — matching you with a compatible caregiver who fits your schedule and preferences.' },
        { step: '03', title: 'Meet Your Caregiver', icon: UserCheck, desc: 'We introduce you to your caregiver before services begin, ensuring you are fully comfortable and confident in your choice.' },
        { step: '04', title: 'Care Begins', icon: CalendarDays, desc: 'Services start on your terms. We continuously monitor, gather feedback, and refine the plan so your care always improves.' }
    ];



    const faqs = [
        { q: 'What areas does Royal Grace Care Services cover?', a: 'We currently serve the Calgary and surrounding areas in Alberta, Canada. Please contact us to confirm if we cover your specific neighbourhood.' },
        { q: 'Are your caregivers professionally vetted?', a: 'Yes. Every caregiver undergoes a thorough background check, reference verification, and comprehensive training before they are placed with any client. Your safety is our highest priority.' },
        { q: 'What is the minimum hours of service per visit?', a: 'Our standard minimum visit is 2 hours. However, we are flexible and happy to discuss packages tailored to your unique schedule and needs.' },
        { q: 'Can I change or cancel my scheduled service?', a: 'Yes. We ask for at least 24 hours notice for cancellations or changes. We understand that life happens and do our best to accommodate your schedule.' },
        { q: 'How do I pay for services?', a: 'We accept payment via bank transfer and other methods. Invoices are generated after each service cycle and can be reviewed and paid directly through your secure client portal.' },
        { q: 'Can family members stay updated on the care?', a: 'Absolutely. Family members can be given access to the client portal where they can view visit reports, caregiver notes, upcoming bookings, and invoices in real time.' }
    ];

    const whyUs = [
        { icon: BadgeCheck, title: 'Fully Vetted Caregivers', desc: 'Every member of our team passes rigorous background checks, professional reference verifications, and ongoing quality assessments.' },
        { icon: Handshake, title: 'Personalised Matching', desc: 'We don\'t just assign caregivers — we carefully match personalities, schedules, and preferences to create a lasting, meaningful bond.' },
        { icon: Smile, title: 'Dignity-First Approach', desc: 'Every action we take is rooted in respect for your loved one\'s autonomy, privacy, and individual identity.' },
        { icon: MessageCircle, title: 'Transparent Communication', desc: 'You\'ll always know what\'s happening. Regular reports, open channels, and an always-accessible client portal keep families informed.' },
        { icon: Globe2, title: 'Flexible Scheduling', desc: 'Need early mornings, weekends, or occasional visits? Our services flex to fit your life — not the other way around.' },
        { icon: Building2, title: 'Local & Committed', desc: 'We are a Canadian, community-rooted company. We understand the local landscape and are committed to families right here in Calgary.' }
    ];

    return (
        <div style={{ backgroundColor: C.light }} className="min-h-screen font-sans overflow-x-hidden text-[#0A192F] selection:bg-[#D4AF37] selection:text-[#0A192F]">
            <Head title="Royal Grace Care Services | Compassionate Non-Medical Support in Calgary" />

            {/* ── NAVBAR ── */}
            <motion.header
                initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm py-3' : 'bg-transparent py-5'}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-3 group z-50">
                        <img
                            src="/images/logo.png"
                            alt="Royal Grace Care Services"
                            className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="hidden sm:block">
                            <p className={`text-lg font-extrabold tracking-tight leading-none transition-colors duration-300 ${isScrolled ? 'text-[#0A192F]' : 'text-white'}`}>Royal Grace</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: C.sage }}>Care Services</p>
                            <p className={`text-[8px] italic transition-colors duration-300 ${isScrolled ? 'text-gray-400' : 'text-white/50'}`}>Compassionate Support. Trusted Care.</p>
                        </div>
                    </a>

                    <nav className="hidden xl:flex items-center space-x-1">
                        {navLinks.map((item) => (
                            <a key={item.name} href={item.href}
                                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${isScrolled ? 'text-[#0A192F] hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden xl:flex items-center gap-5">
                        <a href="tel:4036697455" className={`flex items-center gap-2 text-sm font-bold transition-colors ${isScrolled ? 'text-[#0A192F]' : 'text-white'}`}>
                            <Phone size={16} style={{ color: C.sage }} /> 403-669-7455
                        </a>
                        {auth?.user ? (
                            <Link href="/dashboard" className="px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg hover:-translate-y-0.5 transition-transform" style={{ backgroundColor: C.navy }}>Dashboard</Link>
                        ) : (
                            <div className="flex gap-3">
                                <Link href="/login" className={`px-3 py-2 text-sm font-bold transition-colors ${isScrolled ? 'text-[#0A192F]' : 'text-white'}`}>Log In</Link>
                                <Link href="/register" className="px-6 py-3 rounded-full text-sm font-bold shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-all" style={{ backgroundColor: C.gold, color: C.navy }}>Get Started</Link>
                            </div>
                        )}
                    </div>

                    <button className={`xl:hidden z-50 p-2 rounded-full transition-colors ${isScrolled || mobileMenuOpen ? 'text-[#0A192F]' : 'text-white'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </motion.header>

            {/* ── MOBILE MENU ── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-white pt-28 px-6 pb-12 overflow-y-auto xl:hidden flex flex-col">
                        <div className="space-y-1 mb-10">
                            {navLinks.map(item => (
                                <a key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}
                                    className="block py-4 text-2xl font-extrabold text-[#0A192F] border-b border-gray-100 last:border-0">
                                    {item.name}
                                </a>
                            ))}
                        </div>
                        <a href="tel:4036697455" className="flex items-center gap-4 text-xl font-bold mb-8" style={{ color: C.navy }}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(157,193,131,0.15)', color: C.sage }}>
                                <Phone size={22} />
                            </div>
                            403-669-7455
                        </a>
                        <div className="flex flex-col gap-4 mt-auto">
                            {auth?.user ? (
                                <Link href="/dashboard" className="py-4 rounded-full text-center text-lg font-bold text-white" style={{ backgroundColor: C.navy }}>Dashboard</Link>
                            ) : (
                                <>
                                    <Link href="/register" className="py-4 rounded-full text-center text-lg font-bold" style={{ backgroundColor: C.gold, color: C.navy }}>Get Started — Free Consultation</Link>
                                    <Link href="/login" className="py-4 rounded-full text-center text-lg font-bold bg-gray-100 text-[#0A192F]">Log In</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HERO CAROUSEL ── */}
            <section id="home" className="relative min-h-screen flex items-center pt-28 pb-24 overflow-hidden">
                <HeroCarousel current={currentSlide} setCurrent={setCurrentSlide} />

                <motion.div style={{ y: y1, opacity: opacity1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <motion.div className="lg:col-span-8 xl:col-span-7 text-center lg:text-left" initial="hidden" animate="visible" variants={stagger}>
                            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm text-sm font-bold text-white mb-8">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute h-full w-full rounded-full opacity-75" style={{ backgroundColor: C.sage }} />
                                    <span className="relative rounded-full h-2.5 w-2.5" style={{ backgroundColor: C.sage }} />
                                </span>
                                Now serving Calgary &amp; surrounding areas
                            </motion.div>
                            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-extrabold text-white leading-[1.03] tracking-tight mb-8" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                                Compassionate Support, <br />
                                <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>
                                    Trusted Care.
                                </span>
                            </motion.h1>
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={currentSlide}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2 className="text-2xl lg:text-3xl text-white font-bold mb-3 drop-shadow-md">
                                        {heroSlides[currentSlide].title}
                                    </h2>
                                    <p className="text-lg lg:text-xl text-gray-100 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-12 drop-shadow-md">
                                        {heroSlides[currentSlide].desc}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                                <a href="#contact" className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:shadow-[0_0_70px_rgba(212,175,55,0.6)] hover:-translate-y-1" style={{ backgroundColor: C.gold, color: C.navy }}>
                                    Book a Free Consultation <ArrowRight size={20} />
                                </a>
                                <a href="tel:4036697455" className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-full border-2 font-bold text-lg text-white transition-all hover:bg-white/10 backdrop-blur-sm group" style={{ borderColor: 'rgba(255,255,255,0.35)' }}>
                                    <Phone size={20} className="group-hover:animate-bounce" style={{ color: C.sage }} />
                                    403-669-7455
                                </a>
                            </motion.div>
                            <motion.div variants={fadeUp} className="mt-14 flex flex-wrap items-center justify-center lg:justify-start gap-8">
                                {[{ icon: MapPin, text: 'Calgary, AB' }, { icon: Clock, text: '24/7 Available' }, { icon: BadgeCheck, text: 'Vetted Caregivers' }].map((item) => (
                                    <div key={item.text} className="flex items-center gap-2.5 text-white/80 text-sm font-semibold">
                                        <item.icon size={16} style={{ color: C.sage }} />
                                        {item.text}
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
            </section>



            {/* ── SERVICES ── */}
            <section id="services" className="py-32 relative bg-white overflow-hidden">
                <div className="absolute top-0 -right-1/4 w-1/2 h-full opacity-30" style={{ background: `radial-gradient(ellipse at right, ${C.sage}22, transparent 70%)` }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-3xl mx-auto mb-20">
                        <SectionLabel text="Our Services" />
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6" style={{ color: C.navy }}>
                            Everything your loved one needs, <span className="italic font-light text-gray-400">under one roof.</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-light leading-relaxed">
                            We offer a full spectrum of non-medical home care services, each delivered with the highest standard of compassion and professionalism.
                        </p>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((s, i) => (
                            <motion.div key={i} variants={fadeUp}
                                className="group relative bg-gray-50 hover:bg-white rounded-[2rem] border border-gray-100 hover:border-gray-200 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
                                style={{ transform: expandedService === i ? 'none' : undefined }}>
                                {/* Card Header — always visible */}
                                <button
                                    className="w-full flex items-center gap-5 p-8 text-left"
                                    onClick={() => setExpandedService(expandedService === i ? null : i)}
                                >
                                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500" style={{ backgroundColor: `${s.color}18`, color: s.color }}>
                                        <s.icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold" style={{ color: C.navy }}>{s.title}</h3>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider mt-1 transition-colors" style={{ color: s.color }}>
                                            {expandedService === i ? 'Close' : 'Learn More'}
                                            <ChevronDown
                                                size={13}
                                                style={{ transform: expandedService === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                                            />
                                        </span>
                                    </div>
                                </button>
                                {/* Expandable description */}
                                <AnimatePresence>
                                    {expandedService === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-8 pb-8 border-t border-gray-100 pt-4">
                                                <ul className="list-disc pl-5 text-gray-500 leading-relaxed space-y-2">
                                                    {s.desc.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── ABOUT / MISSION ── */}
            <section id="about" className="py-32 relative overflow-hidden" style={{ backgroundColor: C.navy }}>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                            <motion.div variants={fadeUp}><SectionLabel text="Our Story" light /></motion.div>
                            <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-8">
                                Founded on <br /><span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>compassion.</span>
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-xl text-gray-300 font-light leading-relaxed mb-8">
                                Royal Grace Care Services was born from a deeply personal experience. Our founder, having seen firsthand the challenge families face finding trustworthy, compassionate home support, built a company dedicated to filling that gap with excellence.
                            </motion.p>
                            <motion.p variants={fadeUp} className="text-xl text-gray-400 font-light leading-relaxed mb-12">
                                We are a Canadian company rooted in the Calgary community. Every decision we make is guided by a simple question: <em className="text-white">"Would we be proud to have this caregiver look after our own family?"</em>
                            </motion.p>
                            <motion.div variants={fadeUp} className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: C.gold }}>
                                        <Stethoscope size={18} />
                                    </div>
                                    <span className="text-white font-semibold">Non-Medical Focus</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(157,193,131,0.15)', color: C.sage }}>
                                        <MapPin size={18} />
                                    </div>
                                    <span className="text-white font-semibold">Proudly Canadian</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
                            className="grid grid-cols-2 gap-5">
                            {[
                                { icon: Heart, val: 'Client-First', sub: 'Every decision starts with your comfort and dignity.', col: C.gold },
                                { icon: ShieldCheck, val: 'Safety Always', sub: 'Vetted professionals and rigorous safety protocols.', col: C.sage },
                                { icon: Award, val: 'Excellence', sub: 'We set — and exceed — the highest care standards.', col: C.gold },
                                { icon: Users, val: 'Family Partners', sub: 'We keep families connected and fully informed.', col: C.sage }
                            ].map((v, i) => (
                                <div key={i} className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center" style={{ backgroundColor: `${v.col}15`, color: v.col }}>
                                        <v.icon size={22} />
                                    </div>
                                    <p className="text-white font-bold text-lg mb-2">{v.val}</p>
                                    <p className="text-gray-400 text-sm leading-relaxed">{v.sub}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── WHY CHOOSE US ── */}
            <section id="why-us" className="py-32 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0A192F] to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-3xl mx-auto mb-20">
                        <SectionLabel text="Why Choose Us" />
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6" style={{ color: C.navy }}>
                            The Royal Grace <span className="italic font-light text-gray-400">difference.</span>
                        </h2>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {whyUs.map((item, i) => (
                            <motion.div key={i} variants={fadeUp}
                                className="bg-white rounded-[2rem] p-9 border border-gray-100 hover:shadow-xl transition-all duration-400 hover:-translate-y-1 group">
                                <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: i % 2 === 0 ? 'rgba(212,175,55,0.1)' : 'rgba(157,193,131,0.1)', color: i % 2 === 0 ? C.gold : C.sageDark }}>
                                    <item.icon size={26} />
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: C.navy }}>{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="process" className="py-32 bg-white relative overflow-hidden">
                <div className="absolute inset-y-0 right-0 w-1/2 opacity-20" style={{ background: `radial-gradient(ellipse at right, ${C.gold}33, transparent 70%)` }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-3xl mx-auto mb-24">
                        <SectionLabel text="How It Works" />
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6" style={{ color: C.navy }}>
                            Getting started is <span className="italic font-light text-gray-400">simple.</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-light leading-relaxed">
                            From your first call to your first visit, we make every step clear, warm, and stress-free.
                        </p>
                    </motion.div>
                    <div className="relative">
                        <div className="hidden lg:block absolute top-20 left-[12%] right-[12%] h-px border-t-2 border-dashed z-0" style={{ borderColor: 'rgba(157,193,131,0.3)' }} />
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                            className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                            {process.map((p, i) => (
                                <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center group">
                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all group-hover:scale-110 duration-300 group-hover:shadow-2xl" style={{ backgroundColor: i % 2 === 0 ? C.navy : C.sage }}>
                                            <p.icon size={30} className="text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-white" style={{ backgroundColor: C.gold, color: C.navy }}>
                                            {i + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3" style={{ color: C.navy }}>{p.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">{p.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-16 text-center">
                        <a href="#contact" className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all" style={{ backgroundColor: C.navy, color: C.gold }}>
                            Start Your Journey Today <ArrowRight size={20} />
                        </a>
                    </motion.div>
                </div>
            </section>



            {/* ── FAQ ── */}
            <section id="faq" className="py-32 bg-white relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
                        <SectionLabel text="Frequently Asked Questions" />
                        <h2 className="text-5xl font-extrabold tracking-tight" style={{ color: C.navy }}>
                            Got questions? <span className="italic font-light text-gray-400">We have answers.</span>
                        </h2>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div key={i} variants={fadeUp}
                                className="rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-gray-200 hover:shadow-sm">
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 p-7 text-left font-bold text-lg transition-colors hover:bg-gray-50"
                                    style={{ color: C.navy }}>
                                    {faq.q}
                                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0">
                                        <ChevronDown size={22} style={{ color: C.sage }} />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                                            <p className="px-7 pb-7 text-gray-500 leading-relaxed text-base">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CONTACT CTA ── */}
            <section id="contact" className="py-32 relative overflow-hidden" style={{ backgroundColor: C.navy }}>
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full opacity-10 blur-[160px]" style={{ backgroundColor: C.sage }} />
                </div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
                        <motion.div variants={fadeUp}><SectionLabel text="Get In Touch" light /></motion.div>
                        <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-8">
                            Ready to get started?<br />
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${C.gold}, ${C.goldLight})` }}>Let's talk.</span>
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-xl text-gray-300 font-light max-w-2xl mx-auto mb-14">
                            Call us today for a free, no-obligation consultation. We'll listen, understand your needs, and explain exactly how we can help.
                        </motion.p>
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                            <a href="tel:4036697455" className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-6 rounded-full font-bold text-xl transition-all shadow-[0_0_60px_rgba(212,175,55,0.4)] hover:shadow-[0_0_80px_rgba(212,175,55,0.6)] hover:-translate-y-1" style={{ backgroundColor: C.gold, color: C.navy }}>
                                <Phone size={24} /> 403-669-7455
                            </a>
                            <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-6 rounded-full border-2 font-bold text-xl text-white transition-all hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                                Create Account <ArrowRight size={22} />
                            </Link>
                        </motion.div>
                        <motion.div variants={fadeUp} className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            {[
                                { icon: Phone, label: 'Phone', value: '403-669-7455', href: 'tel:4036697455' },
                                { icon: Mail, label: 'Email', value: 'info@rgcareservices.com', href: 'mailto:info@rgcareservices.com' },
                                { icon: MapPin, label: 'Location', value: 'Calgary, Alberta, Canada', href: '#' }
                            ].map((item, i) => (
                                <a key={i} href={item.href}
                                    className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 group">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(157,193,131,0.15)', color: C.sage }}>
                                        <item.icon size={22} />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">{item.label}</p>
                                    <p className="text-white font-semibold text-sm text-center leading-snug">{item.value}</p>
                                </a>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="pt-20 pb-10 border-t" style={{ backgroundColor: '#030B18', borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <a href="/" className="flex items-center gap-4 mb-6">
                                <img
                                    src="/images/logo.png"
                                    alt="Royal Grace Care Services"
                                    className="h-16 w-auto object-contain"
                                />
                                <div>
                                    <span className="text-2xl font-extrabold text-white tracking-tight block">Royal Grace</span>
                                    <span className="text-xs font-semibold tracking-widest uppercase block" style={{ color: C.sage }}>Care Services</span>
                                    <span className="text-xs italic text-gray-400">Compassionate Support. Trusted Care.</span>
                                </div>
                            </a>
                            <p className="text-gray-400 font-light leading-relaxed max-w-sm mb-6">
                                Compassionate, non-medical support and wellness-focused care designed to help individuals live comfortably, safely, and independently.
                            </p>
                            <a href="tel:4036697455" className="inline-flex items-center gap-3 text-lg font-bold text-white hover:text-[#D4AF37] transition-colors">
                                <Phone size={18} style={{ color: C.sage }} /> 403-669-7455
                            </a>
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Quick Links</h4>
                            <ul className="space-y-3 text-gray-400 font-medium text-sm">
                                {[['#home', 'Home'], ['#services', 'Our Services'], ['#about', 'About Us'], ['#process', 'How It Works'], ['#faq', 'FAQ'], ['#contact', 'Contact']].map(([href, label]) => (
                                    <li key={href}><a href={href} className="hover:text-white hover:translate-x-1 inline-block transition-all">{label}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Client Portal</h4>
                            <ul className="space-y-3 text-gray-400 font-medium text-sm">
                                <li><Link href="/login" className="hover:text-white transition-colors">Client Log In</Link></li>
                                <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
                                <li><Link href="/login" className="hover:text-white transition-colors">Caregiver Portal</Link></li>
                                <li><Link href="/login" className="hover:text-white transition-colors">Family Portal</Link></li>
                            </ul>
                            <div className="mt-8 p-5 rounded-2xl border" style={{ borderColor: 'rgba(212,175,55,0.2)', backgroundColor: 'rgba(212,175,55,0.05)' }}>
                                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: C.gold }}>Hours of Operation</p>
                                <p className="text-white text-sm font-semibold">Mon – Fri: 8am – 6pm</p>
                                <p className="text-gray-400 text-sm">24/7 Emergency Support Available</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Royal Grace Care Services. All rights reserved.</p>
                        <p className="text-gray-500 text-sm">Powered by <span className="text-white font-bold">Atlev Ltd</span></p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
