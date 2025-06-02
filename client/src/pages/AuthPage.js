// client/src/pages/AuthPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const navigate = useNavigate();

    // Define API_BASE_URL once at the top,
    // ensuring it's always read from the environment variable.
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const url = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;

        console.log("Attempting API call to:", url);
        console.log("Sending data:", formData); // Be careful not to log passwords in production!

        try {
            const res = await axios.post(url, formData);
            console.log("API call successful! Response:", res.data);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            setSuccessMessage(res.data.message);
            setTimeout(() => {
                navigate('/home', { state: { authSuccess: true } });
            }, 1500);

        } catch (err) {
            console.error("API call FAILED! Error details:", err);
            console.error("Error response data:", err.response?.data);
            console.error("Error message:", err.message);
            setError(err.response?.data?.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>SHARE IDEA</h2>
                    <p>{isLogin ? 'Log in to check out ideas ' : 'Hi!'}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="bear@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'LOGIN WITH EMAIL' : 'SIGN UP')}
                    </button>

                    <div className="auth-footer-links">
                        {isLogin ? (
                            <React.Fragment>
                                <p>Didn't have an account ? <a href="#" onClick={() => { setIsLogin(false); setError(null); setSuccessMessage(null); }}>Sign Up</a></p>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <p>Already have an account ? <a href="#" onClick={() => { setIsLogin(true); setError(null); setSuccessMessage(null); }}>Log In</a></p>
                            </React.Fragment>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthPage;