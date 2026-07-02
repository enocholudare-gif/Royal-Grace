import React, { useState } from 'react';

export default function AuthPasswordInput({ id, label, value = '', onChange, placeholder = '', error = '', required = false, autocomplete = '', help = '', disabled = false }) {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPassword ? 'text' : 'password';
    const inputClass = `form-input pr-12 ${error ? 'border-danger-300 focus:border-danger-500' : ''}`;

    return (
        <div className="form-group">
            <label htmlFor={id} className={`form-label ${required ? 'form-required' : ''}`}>
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={inputType}
                    value={value}
                    placeholder={placeholder}
                    autoComplete={autocomplete}
                    disabled={disabled}
                    className={inputClass}
                    onChange={e => onChange(e.target.value)}
                />

                <button
                    type="button"
                    className="absolute inset-y-0 right-0 inline-flex items-center px-4 text-sm font-medium text-text-soft"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>

            {help && !error && <p className="form-help">{help}</p>}
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
