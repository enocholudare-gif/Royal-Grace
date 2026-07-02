import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayoutShell from './AppLayoutShell';

export default function AuthLayout({ children, title = 'Workspace', description = 'Manage your healthcare operations from one place.', roleLabel = 'Authenticated User', navigation = [], notifications = [] }) {
    const { props } = usePage();
    const user = props.auth?.user ?? {};

    return (
        <AppLayoutShell
            title={title}
            description={description}
            roleLabel={roleLabel}
            navigation={navigation}
            notifications={notifications}
            user={user}
        >
            {children}
        </AppLayoutShell>
    );
}
