


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewIdea.css';

function ViewIdea() {
    const { id } = useParams();
    const [idea, setIdea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interestRegistered, setInterestRegistered] = useState(false); // Track if interest has been registered for this session

    // Define API_BASE_URL from environment variables for consistency
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    console.log("ViewIdea - API_BASE_URL:", API_BASE_URL);

    useEffect(() => {
        const fetchAndRegisterInterest = async () => {
            setLoading(true); // Ensure loading is true at the start of fetch
            setError(null); // Clear previous errors

            try {
                // Fetch the idea details
                const res = await axios.get(`${API_BASE_URL}/api/ideas/${id}`);
                setIdea(res.data);
                console.log("Fetched idea details:", res.data);

                // Register interest only once per visit to this specific idea page.
                // We use interestRegistered state to prevent multiple increments on re-renders.
                if (!interestRegistered) {
                    await axios.post(`${API_BASE_URL}/api/ideas/${id}/interest`);
                    setInterestRegistered(true);
                    console.log("Interest registered for idea:", id);

                    // Optionally, refetch idea to show updated interest count immediately
                    const updatedRes = await axios.get(`${API_BASE_URL}/api/ideas/${id}`);
                    setIdea(updatedRes.data);
                    console.log("Refetched idea with updated interest count:", updatedRes.data);
                }
            } catch (err) {
                console.error(`Error fetching idea or registering interest for ID ${id}:`, err.response?.data?.message || err.message);
                setError(err.response?.data?.message || "Failed to load idea or register interest. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) { // Only attempt to fetch if ID is present
            fetchAndRegisterInterest();
        } else {
            setLoading(false);
            setError("No idea ID provided in the URL.");
        }
    }, [id, API_BASE_URL, interestRegistered]); // Depend on id and API_BASE_URL, and interestRegistered

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
        if (idea.submittedByEmail) { // Assuming your idea model might store email
            window.location.href = `mailto:${idea.submittedByEmail}?subject=Regarding Your Idea: ${encodeURIComponent(idea.title)}`;
        } else {
            alert("No email address provided for this idea's submitter.");
        }
    };

    return (
        <div className="carrd-page-container">
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
                        <img src={getIdeaCartoon(idea._id)} alt="Profile Cartoon" className="carrd-profile-cartoon" />
                        <div className="carrd-profile-info">
                            <span className="carrd-username">@{idea.submittedBy.replace(/\s/g, '').toLowerCase() || 'anonymous'}</span>
                            <p className="carrd-description">
                                {idea.description}
                            </p>
                            <p className="carrd-ib">
                                Project Title: {idea.title}
                            </p>
                            <p className="carrd-interest-count">
                                Total Interests: {idea.interestCount}
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