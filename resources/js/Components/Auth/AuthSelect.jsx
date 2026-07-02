import React from 'react';

export default function AuthSelect({ id, label, value, options = [], error, required, disabled, onChange }) {
    const selectClass = `form-select ${error ? 'border-danger-300 focus:border-danger-500' : ''}`;

    return (
        <div className="form-group">
            <label htmlFor={id} className={`form-label ${required ? 'form-required' : ''}`}>
                {label}
            </label>

            <select
                id={id}
                value={value}
                disabled={disabled}
                className={selectClass}
                onChange={e => onChange(e.target.value)}
            >
                <option value="">Select an option</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
