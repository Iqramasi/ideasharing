import React, {
    useState
} from 'react';

import axios from 'axios';

import {
    useNavigate
} from 'react-router-dom';

import './AuthPage.css';

function AuthPage() {

    const [isLogin, setIsLogin] =
        useState(true);

    const [formData, setFormData] =
        useState({
            name: '',
            email: '',
            password: ''
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [successMessage,
        setSuccessMessage
    ] = useState(null);

    const navigate =
        useNavigate();

    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL ||
        'http://localhost:5000';

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

    };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            setLoading(true);

            setError(null);

            setSuccessMessage(null);

            const url = isLogin

                ? `${API_BASE_URL}/api/auth/login`

                : `${API_BASE_URL}/api/auth/register`;

            try {

                const res =
                    await axios.post(
                        url,
                        formData
                    );

                /*
                =====================================
                LOGIN
                =====================================
                */

                if (isLogin) {

                    localStorage.setItem(
                        'token',
                        res.data.token
                    );

                    localStorage.setItem(
                        'user',
                        JSON.stringify(
                            res.data.user
                        )
                    );

                    localStorage.setItem(
                        'name',
                        res.data.user.name
                    );

                    localStorage.setItem(
                        'email',
                        res.data.user.email
                    );

                    localStorage.setItem(
                        'userId',
                        res.data.user._id
                    );

                    setSuccessMessage(
                        res.data.message ||
                        'Login successful'
                    );

                    setTimeout(() => {

                        navigate(
                            '/home',
                            {
                                state: {
                                    authSuccess: true
                                }
                            }
                        );

                    }, 1000);

                }

                /*
                =====================================
                REGISTER
                =====================================
                */

                else {

                    setSuccessMessage(
                        res.data.message ||
                        'OTP sent successfully'
                    );

                    setTimeout(() => {

                        navigate(
                            '/verify-otp',
                            {
                                state: {
                                    email:
                                        res.data.email
                                }
                            }
                        );

                    }, 1000);

                }

            } catch (err) {

                console.error(
                    "Auth Error:",
                    err.response?.data?.message ||
                    err.message
                );

                setError(
                    err.response?.data?.message ||
                    'Authentication failed'
                );

            } finally {

                setLoading(false);

            }

        };

    return (

        <div className="auth-page-container">

            <div className="auth-card">

                <div className="auth-header">

                    <h2>
                        SHARE IDEA
                    </h2>

                    <p>

                        {

                            isLogin

                                ? 'Log in to explore ideas'

                                : 'Create your account'

                        }

                    </p>

                </div>

                <form

                    onSubmit={handleSubmit}

                    className="auth-form"

                >

                    {

                        !isLogin && (

                            <div className="form-group">

                                <label>
                                    Name
                                </label>

                                <input

                                    type="text"

                                    name="name"

                                    placeholder="Your Name"

                                    value={formData.name}

                                    onChange={handleChange}

                                    required

                                    disabled={loading}

                                />

                            </div>

                        )

                    }

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input

                            type="email"

                            name="email"

                            placeholder="your@email.com"

                            value={formData.email}

                            onChange={handleChange}

                            required

                            disabled={loading}

                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input

                            type="password"

                            name="password"

                            placeholder="********"

                            value={formData.password}

                            onChange={handleChange}

                            required

                            minLength={6}

                            disabled={loading}

                        />

                    </div>

                    {

                        error && (

                            <p className="error-message">

                                {error}

                            </p>

                        )

                    }

                    {

                        successMessage && (

                            <p className="success-message">

                                {successMessage}

                            </p>

                        )

                    }

                    <button

                        type="submit"

                        className="auth-button"

                        disabled={loading}

                    >

                        {

                            loading

                                ? 'Processing...'

                                : isLogin

                                    ? 'LOGIN'

                                    : 'SIGN UP'

                        }

                    </button>

                    <div
                        className="auth-footer-links"
                    >

                        {

                            isLogin

                                ? (

                                    <p>

                                        Don't have an account?

                                        <button

                                            type="button"

                                            onClick={() => {

                                                setIsLogin(false);

                                                setError(null);

                                                setSuccessMessage(null);

                                            }}

                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#00bfff',
                                                cursor: 'pointer',
                                                marginLeft: '5px'
                                            }}

                                        >

                                            Sign Up

                                        </button>

                                    </p>

                                )

                                : (

                                    <p>

                                        Already have an account?

                                        <button

                                            type="button"

                                            onClick={() => {

                                                setIsLogin(true);

                                                setError(null);

                                                setSuccessMessage(null);

                                            }}

                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#00bfff',
                                                cursor: 'pointer',
                                                marginLeft: '5px'
                                            }}

                                        >

                                            Login

                                        </button>

                                    </p>

                                )

                        }

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AuthPage;