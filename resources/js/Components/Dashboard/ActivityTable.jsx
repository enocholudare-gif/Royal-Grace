import React from 'react';

export default function ActivityTable({ title, subtitle = '', columns = [], rows = [] }) {
    const renderStatus = (status) => {
        const lower = String(status || '').toLowerCase();
        let indicatorClass = 'status-pending';
        if (['confirmed', 'assigned', 'in_progress'].includes(lower)) {
            indicatorClass = 'status-info';
        } else if (lower === 'completed') {
            indicatorClass = 'status-active';
        } else if (['cancelled', 'refunded'].includes(lower)) {
            indicatorClass = 'status-danger';
        }

        return (
            <span className={`status-indicator ${indicatorClass}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="table-wrap">
            <div className="card-header">
                <div>
                    <p className="card-title">{title}</p>
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
            </div>

            <table className="table-standard">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.id || index}>
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {column.render 
                                        ? column.render(row) 
                                        : column.key === 'status' 
                                            ? renderStatus(row[column.key]) 
                                            : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="table-empty">
                                No records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
