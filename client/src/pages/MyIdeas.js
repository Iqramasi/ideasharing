import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './IdeaList.css';

function MyIdeas() {

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            try {

                const res =
                    await axios.get(
                        `${API_BASE_URL}/api/ideas`
                    );

                const myIdeas =
                    res.data.filter(
                        idea =>
                            idea.userId ===
                            currentUserId
                    );

                setIdeas(myIdeas);

            } catch (err) {

                console.error(err);

                setError(
                    'Failed to load your ideas.'
                );

            } finally {

                setLoading(false);

            }

        };

        fetchIdeas();

    }, [
        API_BASE_URL,
        currentUserId
    ]);

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                'Delete this idea permanently?'
            );

        if (!confirmDelete)
            return;

        try {

            await axios.delete(
                `${API_BASE_URL}/api/ideas/${id}`
            );

            setIdeas(

                ideas.filter(
                    idea =>
                        idea._id !== id
                )

            );

            alert(
                'Idea deleted successfully!'
            );

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
                Loading your ideas...
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
        MY IDEAS
    </h1>

            {

                ideas.length === 0

                    ? (

                        <p className="no-ideas-message">

                            You haven't submitted any ideas yet.

                        </p>

                    )

                    : (

                        <div className="ideas-display-flex">

                            {

                                ideas.map((idea) => (

                                    <div
                                        key={idea._id}
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

                                                    YOU

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

                                                    👍 {

                                                        idea.interestedUsers

                                                            ? idea.interestedUsers.length

                                                            : 0

                                                    }

                                                </span>

                                            </div>

                                        </div>

                                 <div className="idea-actions">

    <button
        className="small-action-btn"
        onClick={() =>
            navigate(`/ideas/${idea._id}`)
        }
    >
        VIEW
    </button>

    <button
        className="small-action-btn delete-btn"
        onClick={() =>
            handleDelete(idea._id)
        }
    >
        DELETE
    </button>

</div>
                                    </div>

                                ))

                            }

                        </div>

                    )

            }


        </div>

    );

}

export default MyIdeas;