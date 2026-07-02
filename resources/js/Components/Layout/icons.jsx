import React from 'react';

const iconProps = {
    className: 'h-5 w-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
};

export function DashboardIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M4 13h7V4H4Zm9 7h7v-9h-7ZM4 20h7v-5H4Zm9-9h7V4h-7Z"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function CalendarIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function UsersIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11A4 4 0 1 0 9.5 3a4 4 0 0 0 0 8Zm9.5 10v-2a4 4 0 0 0-3-3.87M14 4.13a4 4 0 0 1 0 7.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function HeartIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M12 21s-6.5-4.35-6.5-10A4.5 4.5 0 0 1 10 6.5c.86 0 1.66.24 2.3.66A4.45 4.45 0 0 1 14.6 6.5 4.5 4.5 0 0 1 19 11c0 5.65-7 10-7 10Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function WalletIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5Zm0 0A2.5 2.5 0 0 0 6.5 10H19M16 14h.01"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ReportIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M7 18V6M12 18V10M17 18v-4"
                strokeLinecap="round"
            />
            <path
                d="M5 21h14"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function ChatIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M8 10h8M8 14h5M7 19l-3 2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function HomeIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M3 11.5 12 4l9 7.5M5 10v10h14V10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ClipboardIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M9 5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 11h6M9 15h4"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function ClockIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <circle cx="12" cy="12" r="8" />
            <path
                d="M12 8v5l3 2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function FileIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm0 0v5h5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function BellIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.17V11a6 6 0 1 0-12 0v3.17a2 2 0 0 1-.6 1.42L4 17h5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10 17a2 2 0 0 0 4 0"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function ServiceIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M9 12h6M9 8h6M9 16h4M7 4h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function StarIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function SettingsIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ShieldIcon(props) {
    return (
        <svg {...iconProps} {...props}>
            <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
