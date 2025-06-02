// client/src/pages/ViewIdea.js
import React, { useEffect, useState } from 'react'; // <--- CORRECTED LINE HERE
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewIdea.css'; // Ensure this CSS file is used for styling

function ViewIdea() {
    const { id } = useParams();
    const [idea, setIdea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interestRegistered, setInterestRegistered] = useState(false);

    useEffect(() => {
        const fetchAndRegisterInterest = async () => {
            try {
                // Fetch the idea details
                const res = await axios.get(`http://localhost:5000/api/ideas/${id}`);
                setIdea(res.data);

                // Register interest only once when the component mounts/id changes
                if (!interestRegistered) {
                    await axios.post(`http://localhost:5000/api/ideas/${id}/interest`);
                    setInterestRegistered(true);
                    // Optionally, refetch idea to show updated interest count immediately
                    const updatedRes = await axios.get(`http://localhost:5000/api/ideas/${id}`);
                    setIdea(updatedRes.data);
                }
            } catch (err) {
                console.error("Error fetching idea or registering interest:", err);
                setError("Failed to load idea or register interest. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAndRegisterInterest();
    }, [id, interestRegistered]);

    if (loading) return <p className="loading-message">Loading project details...</p>;
    if (error) return <p className="error-message">Error: {error}</p>;
    if (!idea) return <p className="not-found-message">Project idea not found.</p>;

    // Dynamically select the cartoon image based on idea._id
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
        if (!ideaId) return cartoonImages.length > 0 ? cartoonImages[0] : null;
        const hash = ideaId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return cartoonImages[hash % cartoonImages.length];
    };

    const handleSendMessage = () => {
        if (idea.submittedByEmail) {
            window.location.href = `mailto:${idea.submittedByEmail}?subject=Regarding Your Idea: ${encodeURIComponent(idea.title)}`;
        } else {
            alert("No email address provided for this idea's submitter.");
        }
    };

    return (
        <div className="carrd-page-container">
            {/* REMOVED: The div for the large cartoon image above the frame */}
            {/*
            <div className="top-display-image-container">
                <img
                    src={getIdeaCartoon(idea._id)}
                    alt={`Main Idea Cartoon for ${idea.title}`}
                    className="top-display-image"
                />
            </div>
            */}

            <div className="carrd-frame">
                <div className="carrd-browser-header">
                    <div className="carrd-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                    </div>
                    <div className="carrd-controls">
                        <span>&lt;</span>
                        <span>&gt;</span>
                        <span>X</span>
                    </div>
                </div>

                <div className="carrd-tab-bar">
                   
                    <span className="carrd-tab-text">Check Idea</span>
                   
                </div>

                <div className="carrd-content-area">
                    <div className="carrd-profile-header">
                        {/* This is the smaller image inside the card, keep this */}
                        <img src={getIdeaCartoon(idea._id)} alt="Profile Cartoon" className="carrd-profile-cartoon" />
                        <div className="carrd-profile-info">
                            <span className="carrd-username">@{idea.submittedBy.replace(/\s/g, '').toLowerCase() || 'anonymous'}</span>
                            <p className="carrd-description">
                                {idea.description}
                            </p>
                            <p className="carrd-ib">
                                Project Title: {idea.title}
                            </p>
                        </div>
                    </div>

                    <div className="carrd-action-buttons">
                        <button className="carrd-message-button" onClick={handleSendMessage}>
                            send message <span className="arrow-right"></span>
                        </button>
                    </div>
                </div>

                
            </div>

            <button onClick={() => window.history.back()} className="back-to-list-button">
                Back to Ideas
            </button>
        </div>
    );
}

export default ViewIdea;