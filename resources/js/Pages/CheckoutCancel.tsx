import { Head, Link } from '@inertiajs/react';
import { XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutCancel() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
            <Head title="Payment Cancelled - Royal Grace" />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-md text-center"
            >
                <XCircle className="mx-auto h-24 w-24 text-slate-400" />
                <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Payment Cancelled
                </h1>
                <p className="mt-4 text-lg text-slate-600">
                    Your checkout process was cancelled. No charges were made to your account.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href={route('pricing')}
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Return to Pricing
                    </Link>
                    <Link href={route('home')} className="text-sm font-semibold leading-6 text-slate-900">
                        Back to Home <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
