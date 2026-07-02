import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutSuccess() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
            <Head title="Payment Successful - Royal Grace" />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-md text-center"
            >
                <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
                <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Payment Successful!
                </h1>
                <p className="mt-4 text-lg text-slate-600">
                    Thank you for your purchase. Your account has been updated, and you can now access your new features.
                </p>
                <div className="mt-10">
                    <Link
                        href={route('home')}
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
