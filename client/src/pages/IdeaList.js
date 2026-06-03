import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './IdeaList.css';

function IdeaList() {

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL ||
        'http://localhost:5000';

    const currentUserId =
        localStorage.getItem('userId');

    const cartoonImages = [
        '/bears/bear5.png',
        '/bears/bear6.png',
        '/bears/bear7.png',
        '/bears/bear8.png',
        '/bears/bear9.png',
        '/bears/bear10.png',
        '/bears/bear11.png',
        '/bears/bear12.png',
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

    useEffect(() => {

        const fetchIdeas = async () => {

            setLoading(true);
            setError(null);

            try {

                const res =
                    await axios.get(
                        `${API_BASE_URL}/api/ideas`
                    );

                setIdeas(res.data);

            } catch (err) {

                console.error(err);

                setError(
                    'Failed to load ideas.'
                );

            } finally {

                setLoading(false);

            }

        };

        fetchIdeas();

    }, [
        refetchTrigger,
        API_BASE_URL
    ]);

    useEffect(() => {

        if (
            location.state?.newIdeaSubmitted
        ) {

            setRefetchTrigger(
                prev => prev + 1
            );

        }

    }, [location.state]);

    const handleShowInterest =
        async (e, ideaId) => {

            e.preventDefault();
            e.stopPropagation();

            try {

                const response =
                    await axios.post(

                        `${API_BASE_URL}/api/ideas/${ideaId}/interest`,

                        {
                            userId:
                                currentUserId
                        }

                    );

                alert(
                    response.data.message
                );

                setIdeas(prevIdeas =>
                    prevIdeas.map(idea =>
                        idea._id === ideaId
                            ? {
                                ...idea,
                                interestedUsers: [
                                    ...(idea.interestedUsers || []),
                                    currentUserId
                                ]
                            }
                            : idea
                    )
                );

            } catch (err) {

                console.error(err);

                alert(
                    err.response?.data?.message ||
                    'Failed to register interest.'
                );

            }

        };

    if (loading) {

        return (
            <p className="loading-message">
                Loading ideas...
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

    return (

        <div className="idea-list-page-container">
            <button
    className="top-back-arrow"
    onClick={() => navigate('/home')}
>
    ←
</button>
            <h1>
                SHOW INTEREST
            </h1>

            {

                ideas.length === 0

                    ? (

                        <p className="no-ideas-message">

                            No ideas available.

                        </p>

                    )

                    : (

                        <div className="ideas-display-flex">

                            {

                                ideas.map((idea) => {

                                    const alreadyLiked =
                                        idea.interestedUsers?.includes(
                                            currentUserId
                                        );

                                    return (

                                        <Link

                                            key={idea._id}

                                            to={`/ideas/${idea._id}`}

                                            className="idea-card-link-wrapper"

                                        >

                                            <div className="idea-card">

                                                <div className="card-top-header">

                                                    <span className="card-title-text">

                                                        {
                                                            idea.title
                                                                .substring(0, 10)
                                                                .toUpperCase()
                                                        }

                                                    </span>

                                                    <span className="card-creator-name">

                                                        {
                                                            idea.submittedBy ||
                                                            'Anonymous'
                                                        }

                                                    </span>

                                                </div>

                                                <div className="card-image-section">

                                                    <img

                                                        src={
                                                            getIdeaCartoon(
                                                                idea._id
                                                            )
                                                        }

                                                        alt={idea.title}

                                                        className="card-cartoon-image"

                                                    />

                                                </div>

                                                <div className="card-stats-bar">

                                                    <span className="stat-item">

                                                        {

                                                            idea.submittedBy

                                                                ? `${idea.submittedBy.toUpperCase()}'S WORLD`

                                                                : "ANONYMOUS'S WORLD"

                                                        }

                                                    </span>

                                                    <div className="interest-display">

                                                        <button

                                                            className="thumbs-up-button"

                                                            disabled={
                                                                alreadyLiked
                                                            }

                                                            onClick={(e) =>
                                                                handleShowInterest(
                                                                    e,
                                                                    idea._id
                                                                )
                                                            }

                                                        >

                                                            {
                                                                alreadyLiked
                                                                    ? '❤️'
                                                                    : '👍'
                                                            }

                                                        </button>

                                                        <span className="interest-count">

                                                            {

                                                                idea.interestedUsers

                                                                    ? idea.interestedUsers.length

                                                                    : 0

                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        </Link>

                                    );

                                })

                            }

                        </div>

                    )

            }

           

        </div>

    );

}

export default IdeaList;