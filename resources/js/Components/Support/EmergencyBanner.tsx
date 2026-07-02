import React from 'react';
import { PhoneCall, AlertTriangle, Mail } from 'lucide-react';

export function EmergencyBanner() {
    return (
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-red-500 rounded-full opacity-20 blur-2xl"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm hidden md:block">
                    <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                        <AlertTriangle className="w-6 h-6 md:hidden" />
                        Need Immediate Assistance?
                    </h3>
                    <p className="text-red-100 mb-4 max-w-2xl">
                        For medical emergencies, please dial 911 immediately. For urgent care-related issues that require immediate attention from our team, use our priority channels below.
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <a 
                            href="tel:+18005551234" 
                            className="flex items-center gap-2 bg-white text-red-600 px-5 py-2.5 rounded-lg font-bold hover:bg-red-50 transition-colors shadow-sm"
                        >
                            <PhoneCall className="w-5 h-5" />
                            1-800-555-1234
                        </a>
                        <a 
                            href="mailto:urgent@royalgrace.com" 
                            className="flex items-center gap-2 bg-red-800/40 hover:bg-red-800/60 text-white px-5 py-2.5 rounded-lg font-medium transition-colors border border-red-500/30"
                        >
                            <Mail className="w-5 h-5" />
                            urgent@royalgrace.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
