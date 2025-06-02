

import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './SubmitIdea.css';

function SubmitIdea() {
    const [form, setForm] = useState({ title: '', description: '', submittedBy: '' });
    const [ideaId, setIdeaId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // IMPORTANT: Define API_BASE_URL and FRONTEND_BASE_URL from environment variables.
    // Fallbacks for local development are provided.
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    const FRONTEND_BASE_URL = process.env.REACT_APP_FRONTEND_BASE_URL || 'http://localhost:3000';

    // Log base URLs to ensure they are being picked up correctly
    console.log("SubmitIdea - API_BASE_URL:", API_BASE_URL);
    console.log("SubmitIdea - FRONTEND_BASE_URL:", FRONTEND_BASE_URL);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        setIdeaId(''); // Reset ideaId before a new submission attempt

        console.log("Submitting form data:", form);

        try {
            // Include x-auth-token header for protected route (if applicable)
            const token = localStorage.getItem('token');
            const headers = token ? { 'x-auth-token': token } : {};

            const res = await axios.post(`${API_BASE_URL}/api/ideas/submit`, form, { headers });

            console.log("API response on idea submission:", res.data);

            if (res.data.ideaId) {
                setIdeaId(res.data.ideaId);
                setSuccessMessage(res.data.message || 'Idea submitted successfully!');
                setForm({ title: '', description: '', submittedBy: '' }); // Clear form on success
            } else {
                // This case should ideally not happen if backend consistently sends ideaId
                console.warn("Backend did not return ideaId in success response:", res.data);
                setError("Idea submitted, but failed to get idea ID for QR code. Please check console.");
            }

        } catch (err) {
            console.error("Error submitting idea:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || "Failed to submit idea. Please try again.");
            setIdeaId(''); // Ensure ideaId is cleared on error
        } finally {
            setLoading(false);
            // Log the value that will be used for the QR code
            const currentQrValue = ideaId ? `${FRONTEND_BASE_URL}/ideas/${ideaId}` : 'No Idea ID yet';
            console.log("qrCodeValue for generation:", currentQrValue);
        }
    };

    // Construct the QR code URL. It will only be a valid URL if ideaId is present.
   const qrCodeValue = ideaId ? `${FRONTEND_BASE_URL}/ideas/${ideaId}` : '';

    return (
        <div className="submit-idea-container">
            <div className="pixel-character"></div>

            <div className="submit-content-wrapper">
                <div className="nameplate-header">
                    <h2>SUBMIT YOUR IDEA</h2>
                </div>

                <div className="main-content-box">
                    <h3 className="box-title">IDEA DETAILS</h3>

                    <div className="form-field-group">
                        <input
                            name="title"
                            placeholder="Title"
                            onChange={handleChange}
                            value={form.title}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-field-group">
                        <textarea
                            name="description"
                            placeholder="Description"
                            onChange={handleChange}
                            value={form.description}
                            disabled={loading}
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div className="form-field-group">
                        <input
                            name="submittedBy"
                            placeholder="Your Name"
                            onChange={handleChange}
                            value={form.submittedBy}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="generate-qr-button"
                        disabled={loading || !form.title || !form.description || !form.submittedBy}
                    >
                        {loading ? 'GENERATING...' : 'GENERATE QR'}
                    </button>

                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {error && <p className="error-message">{error}</p>}

                    {ideaId && (
                        <div className="qr-code-section">
                            <h3 className="qr-box-title">QR GENERATED, SCAN IT</h3>
                            <QRCodeCanvas
                                value={qrCodeValue}
                                size={180}
                                level="H"
                            />
                            <p>
                                Scan this QR code and click here: {' '}
                                <a href={qrCodeValue} target="_blank" rel="noopener noreferrer">View Idea</a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SubmitIdea;