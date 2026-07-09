import React from 'react';

/**
 * AppLogo — shows the Royal Grace logo.
 * @param {boolean} dark   - true = dark background context (sidebar, guest panel)
 * @param {string}  size   - 'sm' | 'md' | 'lg'
 */
export default function AppLogo({ dark = true, size = 'md' }) {
    const heights = { sm: 'h-10', md: 'h-14', lg: 'h-20' };

    return (
        <div className="flex items-center gap-3">
            <img
                src="/images/logo.png"
                alt="Royal Grace Care Services"
                className={`${heights[size]} w-auto object-contain`}
                style={dark ? {} : { filter: 'brightness(0) saturate(100%) invert(10%) sepia(60%) saturate(800%) hue-rotate(195deg) brightness(80%)' }}
            />
            {!dark && (
                <div>
                    <p className="font-heading text-base font-semibold text-[#0A192F] leading-tight">Royal Grace</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9DC183]">Care Services</p>
                    <p className="text-[8px] italic text-gray-400">Compassionate Support. Trusted Care.</p>
                </div>
            )}
        </div>
    );
}
