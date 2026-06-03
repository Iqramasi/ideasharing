import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewIdea.css';

function ViewIdea() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [idea, setIdea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserId =
        localStorage.getItem('userId');

    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL ||
        'http://localhost:5000';

    useEffect(() => {

        const fetchIdea = async () => {

            try {

                const res = await axios.get(
                    `${API_BASE_URL}/api/ideas/${id}`
                );

                setIdea(res.data);

            } catch (err) {

                console.error(err);

                setError(
                    'Failed to load idea.'
                );

            } finally {

                setLoading(false);

            }

        };

        fetchIdea();

    }, [id, API_BASE_URL]);

    const cartoonImages = [
        '/bears/bear1.png',
        '/bears/bear4.png',
        '/bears/bear5.png',
        '/bears/bear6.png',
        '/bears/bear7.png',
        '/bears/bear8.png',
        '/bears/bear9.png',
        '/bears/bear10.png',
        '/bears/bear11.png',
    ];

    const getIdeaCartoon = (ideaId) => {

        if (!ideaId)
            return cartoonImages[0];

        const hash = ideaId
            .split('')
            .reduce(
                (acc, char) =>
                    acc + char.charCodeAt(0),
                0
            );

        return cartoonImages[
            hash % cartoonImages.length
        ];
    };

    const handleContactCreator = () => {

        if (
            idea?.submittedByEmail
        ) {

            window.location.href =
                `mailto:${idea.submittedByEmail}?subject=Regarding ${idea.title}`;

        } else {

            alert(
                'Creator email not available.'
            );

        }

    };

    const handleDelete = async () => {

        const confirmDelete =
            window.confirm(
                'Delete this idea permanently?'
            );

        if (!confirmDelete)
            return;

        try {

            await axios.delete(
                `${API_BASE_URL}/api/ideas/${idea._id}`
            );

            alert(
                'Idea deleted successfully!'
            );

            navigate('/my-ideas');

        } catch (err) {

            console.error(err);

            alert(
                'Failed to delete idea.'
            );

        }

    };

    if (loading) {

        return (
            <p className="loading-message">
                Loading idea...
            </p>
        );

    }

    if (error) {

        return (
            <p className="error-message">
                {error}
            </p>
        );

    }

    if (!idea) {

        return (
            <p className="error-message">
                Idea not found.
            </p>
        );

    }

    return (

        <div className="carrd-page-container">

            <div className="carrd-frame">

                <div className="carrd-browser-header">

                    <div className="carrd-dots">

                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>

                    </div>

                </div>

                <div className="carrd-tab-bar">

                    <span className="carrd-tab-text">
                        PROJECT IDEA
                    </span>

                </div>

                <div className="carrd-content-area">

                    <div className="carrd-profile-header">

                        <img
                            src={
                                getIdeaCartoon(
                                    idea._id
                                )
                            }
                            alt="Idea"
                            className="carrd-profile-cartoon"
                        />

                        <div className="carrd-profile-info">

                            <span className="carrd-username">

                                @
                                {
                                    idea.submittedBy
                                        ?.replace(/\s/g, '')
                                        .toLowerCase()
                                }

                            </span>

                            <p className="carrd-description">
                                {idea.description}
                            </p>

                            <p className="carrd-ib">
                                Project Title: {idea.title}
                            </p>

                            <p className="carrd-interest-count">

                                Interested Users:{" "}

                                {
                                    idea.interestedUsers
                                        ? idea.interestedUsers.length
                                        : 0
                                }

                            </p>

                        </div>

                    </div>

                    <div className="carrd-action-buttons">

                        <button
                            className="carrd-message-button"
                            onClick={
                                handleContactCreator
                            }
                        >
                            Contact Creator
                        </button>

                        {

                            currentUserId ===
                            idea.userId && (

                                <button
                                    className="delete-btn"
                                    onClick={
                                        handleDelete
                                    }
                                >
                                    🗑 Delete Idea
                                </button>

                            )

                        }

                    </div>

                </div>

            </div>

            <button
                className="back-to-list-button"
                onClick={() =>
                    navigate('/home')
                }
            >
                Back To Home
            </button>

        </div>

    );

}

export default ViewIdea;