import React, {
    useState
} from 'react';

import axios from 'axios';

import {
    useNavigate,
    useLocation
} from 'react-router-dom';

const VerifyOtp = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const email =
        location.state?.email || '';

    const [otp, setOtp] =
        useState('');

    const [error, setError] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL ||
        'http://localhost:5000';

    const handleVerify =
        async (e) => {

            e.preventDefault();

            setLoading(true);

            setError('');

            try {

                const res =
                    await axios.post(

                        `${API_BASE_URL}/api/auth/verify-otp`,

                        {
                            email,
                            otp
                        }

                    );

                // Store auth data

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

                // Store user details separately

                localStorage.setItem(
                    'userId',
                    res.data.user._id
                );

                localStorage.setItem(
                    'name',
                    res.data.user.name
                );

                localStorage.setItem(
                    'email',
                    res.data.user.email
                );

                navigate('/home');

            } catch (err) {

                setError(

                    err.response?.data?.message ||

                    'OTP verification failed.'

                );

            } finally {

                setLoading(false);

            }

        };

    return (

        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#111',
                color: '#fff'
            }}
        >

            <form
                onSubmit={handleVerify}
                style={{
                    background: '#222',
                    padding: '30px',
                    borderRadius: '10px',
                    width: '350px'
                }}
            >

                <h2>
                    Verify OTP
                </h2>

                <p>
                    OTP sent to:
                    <br />
                    <strong>
                        {email}
                    </strong>
                </p>

                <input

                    type="text"

                    placeholder="Enter OTP"

                    value={otp}

                    onChange={(e) =>
                        setOtp(
                            e.target.value
                        )
                    }

                    required

                    style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '15px',
                        marginBottom: '15px'
                    }}

                />

                {

                    error && (

                        <p
                            style={{
                                color: 'red'
                            }}
                        >
                            {error}
                        </p>

                    )

                }

                <button

                    type="submit"

                    disabled={loading}

                    style={{
                        width: '100%',
                        padding: '10px',
                        cursor: 'pointer'
                    }}

                >

                    {

                        loading

                            ? 'Verifying...'

                            : 'Verify OTP'

                    }

                </button>

            </form>

        </div>

    );

};

export default VerifyOtp;