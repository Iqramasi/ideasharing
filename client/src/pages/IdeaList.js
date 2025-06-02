


// client/src/pages/IdeaList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './IdeaList.css';

function IdeaList() {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const location = useLocation();

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
        // Add any other missing bear paths here if they exist in your public/bears folder
        // For example: '/bears/bear2.png', '/bears/bear3.png', '/bears/bear12.png'
    ];

    const getIdeaCartoon = (ideaId) => {
        if (!ideaId) return cartoonImages.length > 0 ? cartoonImages[0] : null;
        const hash = ideaId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return cartoonImages[hash % cartoonImages.length];
    };

    useEffect(() => {
        const fetchIdeas = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get('http://localhost:5000/api/ideas');
                setIdeas(res.data);
            } catch (err) {
                console.error("Error fetching ideas:", err);
                setError("Failed to load ideas. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchIdeas();

    }, [refetchTrigger]);

    useEffect(() => {
        if (location.state?.newIdeaSubmitted) {
            setRefetchTrigger(prev => prev + 1);
            // If using react-router-dom v6:
            // navigate(location.pathname, { replace: true, state: {} }); // To clear the state after use
        }
    }, [location.state]);


    const handleShowInterest = async (e, ideaId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setIdeas(prevIdeas =>
                prevIdeas.map(idea =>
                    idea._id === ideaId ? { ...idea, interestCount: (idea.interestCount || 0) + 1 } : idea
                )
            );

            await axios.post(`http://localhost:5000/api/ideas/${ideaId}/interest`);

        } catch (err) {
            console.error("Error registering interest:", err);
            setIdeas(prevIdeas =>
                prevIdeas.map(idea =>
                    idea._id === ideaId ? { ...idea, interestCount: Math.max(0, (idea.interestCount || 0) - 1) } : idea
                )
            );
            setError("Failed to register interest. Please try again.");
        }
    };

    if (loading) {
        return <p className="loading-message">Loading ideas...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="idea-list-page-container">
            <h1>ALL PROJECT IDEAS</h1>
            {ideas.length === 0 ? (
                <p className="no-ideas-message">No ideas submitted yet. Be the first!</p>
            ) : (
                <div className="ideas-display-flex">
                    {ideas.map((idea) => (
                        <Link to={`/ideas/${idea._id}`} className="idea-card-link-wrapper" key={idea._id}>
                            <div className="idea-card">
                                <div className="card-top-header">
                                    <span className="card-title-text">{idea.title.substring(0, 10).toUpperCase()}</span>
                                    <span className="card-creator-name">
                                        {idea.submittedBy || 'Anonymous'}
                                    </span>
                                </div>
                                <div className="card-image-section">
                                    <img
                                        src={getIdeaCartoon(idea._id)}
                                        alt={`Cartoon for ${idea.title}`}
                                        className="card-cartoon-image"
                                    />
                                    {/* REMOVE OR COMMENT OUT THIS LINE TO REMOVE "NO.638" */}
                                    {/* <span className="card-number-placeholder">NO.{idea._id.slice(0, 3).toUpperCase()}</span> */}
                                </div>
                                <div className="card-stats-bar">
                                    <span className="stat-item">
                                        {idea.submittedBy ? `${idea.submittedBy.toUpperCase()}'S WORLD` : 'ANONYMOUS\'S WORLD'}
                                    </span>
                                    <div className="interest-display">
                                        <button
                                            className="thumbs-up-button"
                                            onClick={(e) => handleShowInterest(e, idea._id)}
                                            title="Show Interest"
                                        >
                                            👍
                                        </button>
                                        <span className="interest-count">{idea.interestCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            <button onClick={() => window.history.back()} className="back-button">
                Back to Home
            </button>
        </div>
    );
}

export default IdeaList;