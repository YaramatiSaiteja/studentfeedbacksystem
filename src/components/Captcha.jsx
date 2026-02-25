import React, { useState, useEffect } from 'react';
import { FaRedo } from 'react-icons/fa';

const Captcha = ({ onValidate }) => {
    const [captchaStr, setCaptchaStr] = useState('');
    const [answer, setAnswer] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaStr(result);
        setAnswer('');
        setIsValid(false);
        setHasInteracted(false);
        onValidate(false);
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setAnswer(val);
        setHasInteracted(true);

        // Strict exact match (case-sensitive)
        const valid = val === captchaStr;
        setIsValid(valid);
        onValidate(valid);
    };

    return (
        <div className="mb-3 p-3 bg-light rounded border">
            <label className="form-label mb-2 fw-bold text-muted">Security Verification</label>

            <div className="text-center mb-3">
                <div
                    className="d-inline-block px-4 py-2 bg-white border rounded shadow-sm fw-bolder position-relative"
                    style={{
                        fontSize: '1.5rem',
                        letterSpacing: '5px',
                        fontFamily: 'monospace',
                        color: '#1e3a8a',
                        userSelect: 'none',
                        // Add a subtle disruptive line effect for "captcha" style
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(0,0,0,0.1) 15px, rgba(0,0,0,0.1) 18px)'
                    }}
                >
                    {captchaStr}
                </div>
            </div>

            <div className="d-flex align-items-center gap-2">
                <input
                    type="text"
                    className={`form-control ${hasInteracted ? (isValid ? 'is-valid' : 'is-invalid') : ''}`}
                    placeholder="Enter the code exactly"
                    value={answer}
                    onChange={handleChange}
                    required
                />
                <button type="button" className="btn btn-outline-secondary text-nowrap d-flex align-items-center gap-1" onClick={generateCaptcha}>
                    <FaRedo size={14} /> Refresh
                </button>
            </div>

            {hasInteracted && !isValid && (
                <div className="invalid-feedback d-block mt-1">
                    Incorrect characters. Please try again (case-sensitive).
                </div>
            )}
        </div>
    );
};

export default Captcha;
