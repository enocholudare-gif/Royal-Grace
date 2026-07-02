import fs from 'fs';
import path from 'path';

const files = [
    ["resources/js/Pages/Admin/Calendar/Index.jsx", "Calendar"],
    ["resources/js/Pages/Admin/Bookings/Index.jsx", "Bookings"],
    ["resources/js/Pages/Admin/Services/Index.jsx", "Services"],
    ["resources/js/Pages/Admin/Caregivers/Index.jsx", "Caregivers"],
    ["resources/js/Pages/Admin/Clients/Index.jsx", "Clients"],
    ["resources/js/Pages/Admin/Payments/Index.jsx", "Payments"],
    ["resources/js/Pages/Admin/Reports/Index.jsx", "Reports"],
    ["resources/js/Pages/Admin/Support/Index.jsx", "Support"]
];

const template = `import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    return (
        <>
            <Head title="{TITLE}" />
            <div className="space-y-6">
                <div className="card">
                    <div className="card-body p-6">
                        <h2 className="text-xl font-semibold text-text">{TITLE} Management</h2>
                        <p className="mt-2 text-sm text-text-muted">This module is actively being migrated to React. Stay tuned!</p>
                    </div>
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
`;

files.forEach(([filePath, title]) => {
    const fullPath = path.join('c:/xampp/htdocs/Royal Grace', filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, template.replace(/{TITLE}/g, title));
});

console.log("React stubs created successfully.");
