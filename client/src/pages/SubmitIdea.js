import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './SubmitIdea.css';

function SubmitIdea() {

    const [form, setForm] = useState({

        title: '',

        description: '',

        submittedBy:
            localStorage.getItem('name') || '',

        submittedByEmail:
            localStorage.getItem('email') || '',

        userId:
            localStorage.getItem('userId') || ''

    });

    const [ideaId, setIdeaId] = useState('');

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const [successMessage, setSuccessMessage] =
        useState(null);

    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL ||
        'http://localhost:5000';

    const FRONTEND_BASE_URL =
        process.env.REACT_APP_FRONTEND_BASE_URL ||
        'http://localhost:3000';

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value

        });

    };

    const handleSubmit = async () => {

        setLoading(true);

        setError(null);

        setSuccessMessage(null);

        setIdeaId('');

        try {

            console.log({

                userId:
                    localStorage.getItem(
                        'userId'
                    ),

                email:
                    localStorage.getItem(
                        'email'
                    ),

                name:
                    localStorage.getItem(
                        'name'
                    )

            });

            const token =
                localStorage.getItem(
                    'token'
                );

            const headers =
                token
                    ? {
                          'x-auth-token':
                              token
                      }
                    : {};

            const payload = {

                title:
                    form.title,

                description:
                    form.description,

                submittedBy:
                    localStorage.getItem(
                        'name'
                    ),

                submittedByEmail:
                    localStorage.getItem(
                        'email'
                    ),

                userId:
                    localStorage.getItem(
                        'userId'
                    )

            };

            const res =
                await axios.post(

                    `${API_BASE_URL}/api/ideas/submit`,

                    payload,

                    { headers }

                );

            if (res.data.ideaId) {

                setIdeaId(
                    res.data.ideaId
                );

                setSuccessMessage(

                    res.data.message ||

                    'Idea submitted successfully!'

                );

                setForm({

                    title: '',

                    description: '',

                    submittedBy:
                        localStorage.getItem(
                            'name'
                        ) || '',

                    submittedByEmail:
                        localStorage.getItem(
                            'email'
                        ) || '',

                    userId:
                        localStorage.getItem(
                            'userId'
                        ) || ''

                });

            } else {

                setError(
                    'Idea submitted but no idea ID was returned.'
                );

            }

        } catch (err) {

            console.error(
                err
            );

            setError(

                err.response?.data
                    ?.message ||

                'Failed to submit idea.'

            );

        } finally {

            setLoading(false);

        }

    };

    const qrCodeValue =
        ideaId
            ? `${FRONTEND_BASE_URL}/ideas/${ideaId}`
            : '';

    return (

        <div className="submit-idea-container">

            <div className="pixel-character"></div>

            <div className="submit-content-wrapper">

                <div className="nameplate-header">

                    <h2>
                        SUBMIT YOUR IDEA
                    </h2>

                </div>

                <div className="main-content-box">

                    <h3 className="box-title">

                        IDEA DETAILS

                    </h3>

                    <div className="form-field-group">

                        <input

                            name="title"

                            placeholder="Idea Title"

                            onChange={handleChange}

                            value={form.title}

                            disabled={loading}

                            required

                        />

                    </div>

                    <div className="form-field-group">

                        <textarea

                            name="description"

                            placeholder="Describe your idea..."

                            onChange={handleChange}

                            value={form.description}

                            disabled={loading}

                            rows="4"

                            required

                        />

                    </div>

                    <button

                        onClick={handleSubmit}

                        className="generate-qr-button"

                        disabled={

                            loading ||

                            !form.title ||

                            !form.description

                        }

                    >

                        {

                            loading

                                ? 'GENERATING...'

                                : 'GENERATE QR'

                        }

                    </button>

                    {

                        successMessage && (

                            <p className="success-message">

                                {successMessage}

                            </p>

                        )

                    }

                    {

                        error && (

                            <p className="error-message">

                                {error}

                            </p>

                        )

                    }

                    {

                        ideaId && (

                            <div className="qr-code-section">

                                <h3 className="qr-box-title">

                                    QR GENERATED, SCAN IT

                                </h3>

                                <QRCodeCanvas

                                    value={qrCodeValue}

                                    size={180}

                                    level="H"

                                />

                                <p>

                                    Scan this QR code or click:

                                    {' '}

                                    <a

                                        href={qrCodeValue}

                                        target="_blank"

                                        rel="noopener noreferrer"

                                    >

                                        View Idea

                                    </a>

                                </p>

                            </div>

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default SubmitIdea;