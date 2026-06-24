import { h } from 'vue';

const iconProps = {
    class: 'h-5 w-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
};

export const DashboardIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M4 13h7V4H4Zm9 7h7v-9h-7ZM4 20h7v-5H4Zm9-9h7V4h-7Z',
                'stroke-linejoin': 'round',
            }),
        ]);
    },
};

export const CalendarIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
        ]);
    },
};

export const UsersIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11A4 4 0 1 0 9.5 3a4 4 0 0 0 0 8Zm9.5 10v-2a4 4 0 0 0-3-3.87M14 4.13a4 4 0 0 1 0 7.75',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
        ]);
    },
};

export const HeartIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M12 21s-6.5-4.35-6.5-10A4.5 4.5 0 0 1 10 6.5c.86 0 1.66.24 2.3.66A4.45 4.45 0 0 1 14.6 6.5 4.5 4.5 0 0 1 19 11c0 5.65-7 10-7 10Z',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
        ]);
    },
};

export const WalletIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5Zm0 0A2.5 2.5 0 0 0 6.5 10H19M16 14h.01',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
        ]);
    },
};

export const ReportIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M7 18V6M12 18V10M17 18v-4',
                'stroke-linecap': 'round',
            }),
            h('path', {
                d: 'M5 21h14',
                'stroke-linecap': 'round',
            }),
        ]);
    },
};

export const ChatIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M8 10h8M8 14h5M7 19l-3 2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7Z',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
        ]);
    },
};

export const HomeIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M3 11.5 12 4l9 7.5M5 10v10h14V10',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
        ]);
    },
};

export const ClipboardIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M9 5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2Z',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
            h('path', {
                d: 'M9 11h6M9 15h4',
                'stroke-linecap': 'round',
            }),
        ]);
    },
};

export const ClockIcon = {
    render() {
        return h('svg', iconProps, [
            h('circle', { cx: '12', cy: '12', r: '8' }),
            h('path', {
                d: 'M12 8v5l3 2',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
        ]);
    },
};

export const FileIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm0 0v5h5',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
        ]);
    },
};

export const BellIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.17V11a6 6 0 1 0-12 0v3.17a2 2 0 0 1-.6 1.42L4 17h5',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
            h('path', {
                d: 'M10 17a2 2 0 0 0 4 0',
                'stroke-linecap': 'round',
            }),
        ]);
    },
};

export const ServiceIcon = {
    render() {
        return h('svg', iconProps, [
            h('path', {
                d: 'M9 12h6M9 8h6M9 16h4M7 4h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
        ]);
    },
};
