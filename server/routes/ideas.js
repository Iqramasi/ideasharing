
// module.exports = router;
const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// --- API Endpoints for /api/ideas ---

// @route   GET /api/ideas
// @desc    Get all ideas
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Fetch all documents from the 'ideas' collection, sorted by most recent first
        // This ensures new ideas are at the top.
        const ideas = await Idea.find().sort({ createdAt: -1 });
        res.status(200).json(ideas);
    } catch (err) {
        console.error("Error fetching all ideas:", err);
        res.status(500).json({ message: 'Server error fetching ideas. Please try again later.' });
    }
});

// @route   POST /api/ideas/submit
// @desc    Submit a new idea
// @access  Public
router.post('/submit', async (req, res) => {
    const { title, description, submittedBy, qrCodeUrl, cartoonImageUrl, cardNumber } = req.body;

    if (!title || !description || !submittedBy) {
        return res.status(400).json({ message: 'Title, description, and your name are required fields.' });
    }

    try {
        const newIdea = new Idea({
            title,
            description,
            submittedBy,
            interestCount: 1, // <--- NEW: Initialize interestCount to 1 here
            qrCodeUrl: qrCodeUrl || '',
            cartoonImageUrl: cartoonImageUrl || '',
            cardNumber: cardNumber || ''
        });

        const savedIdea = await newIdea.save();
        res.status(201).json({
            message: 'Idea submitted successfully!',
            ideaId: savedIdea._id
        });
    } catch (err) {
        console.error("Error submitting idea:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Failed to submit idea. Please try again.' });
    }
});

// @route   GET /api/ideas/:id
// @desc    Get a single idea by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found.' });
        }
        res.status(200).json(idea);
    } catch (err) {
        console.error(`Error fetching idea with ID ${req.params.id}:`, err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid idea ID format.' });
        }
        res.status(500).json({ message: 'Server error fetching idea. Please try again.' });
    }
});

// @route   POST /api/ideas/:id/interest
// @desc    Register interest for an idea (increment interestCount)
// @access  Public
router.post('/:id/interest', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found.' });
        }
        idea.interestCount++;
        await idea.save();
        res.status(200).json({
            success: true,
            message: 'Interest registered successfully!',
            interestCount: idea.interestCount
        });
    } catch (err) {
        console.error(`Error registering interest for ID ${req.params.id}:`, err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid idea ID format.' });
        }
        res.status(500).json({ message: 'Failed to register interest. Please try again.' });
    }
});

module.exports = router;

