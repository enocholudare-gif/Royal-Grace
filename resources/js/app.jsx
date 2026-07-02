import './mock-storage';
import '../css/app.css';
import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// Retrieve auth token from localStorage if present and set Authorization header
const token = localStorage.getItem('auth_token');
if (token) {
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
// Ensure axios sends cookies with requests
window.axios.defaults.withCredentials = true;

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob(['./Pages/**/*.jsx', './Pages/**/*.tsx']);
        return pages[`./Pages/${name}.tsx`]
            ? resolvePageComponent(`./Pages/${name}.tsx`, pages)
            : resolvePageComponent(`./Pages/${name}.jsx`, pages);
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#0f766e',
        showSpinner: false,
    },
});
