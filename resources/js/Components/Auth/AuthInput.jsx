import React from 'react';

export default function AuthInput({ id, label, value = '', onChange, type = 'text', placeholder = '', error = '', required = false, autocomplete = '', help = '', disabled = false }) {
    const inputClass = `form-input ${error ? 'border-danger-300 focus:border-danger-500' : ''}`;

    return (
        <div className="form-group">
            <label htmlFor={id} className={`form-label ${required ? 'form-required' : ''}`}>
                {label}
            </label>

            <input
                id={id}
                type={type}
                value={value}
                placeholder={placeholder}
                autoComplete={autocomplete}
                disabled={disabled}
                className={inputClass}
                onChange={e => onChange(e.target.value)}
            />

            {help && !error && <p className="form-help">{help}</p>}
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
