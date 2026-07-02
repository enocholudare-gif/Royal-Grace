import { Head, router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
    const plans = [
        {
            name: 'Basic',
            price: '$10',
            id: 'basic',
            features: [
                'Access to standard caregivers',
                '24/7 Support',
                'Basic health tracking',
                '1 monthly consultation',
            ],
        },
        {
            name: 'Pro',
            price: '$50',
            id: 'pro',
            features: [
                'Access to premium caregivers',
                'Priority 24/7 Support',
                'Advanced health tracking',
                'Unlimited monthly consultations',
                'Personalized care plans',
            ],
            popular: true,
        },
    ];

    const handleCheckout = (planId: string) => {
        router.post(route('checkout'), { plan: planId });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-24 sm:py-32">
            <Head title="Pricing Plans - Royal Grace" />
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base/7 font-semibold text-indigo-600">Pricing</h2>
                    <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                        Choose the right care plan for you
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-slate-600 sm:text-xl/8">
                    Select a plan that best fits your needs. You can upgrade or downgrade at any time.
                </p>
                
                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className={`rounded-3xl p-8 ring-1 sm:p-10 ${
                                plan.popular 
                                    ? 'bg-slate-900 ring-slate-900 text-white shadow-2xl' 
                                    : 'bg-white ring-slate-200 text-slate-900'
                            }`}
                        >
                            <h3 className={`text-2xl font-semibold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                {plan.name}
                            </h3>
                            <p className="mt-4 flex items-baseline gap-x-2">
                                <span className={`text-5xl font-semibold tracking-tight ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                    {plan.price}
                                </span>
                                <span className={plan.popular ? 'text-slate-400' : 'text-slate-500'}>/month</span>
                            </p>
                            <ul role="list" className={`mt-8 space-y-3 text-sm/6 sm:mt-10 ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <Check className={`h-6 w-5 flex-none ${plan.popular ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCheckout(plan.id)}
                                className={`mt-8 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                    plan.popular
                                        ? 'bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                                } shadow-sm`}
                            >
                                Get started today
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
