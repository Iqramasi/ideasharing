const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea'); // Ensure the path to your Idea model is correct

// --- API Endpoints for /api/ideas ---

// @route   GET /api/ideas
// @desc    Get all ideas
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Fetch all documents from the 'ideas' collection, sorted by most recent first
        const ideas = await Idea.find().sort({ createdAt: -1 });
        res.status(200).json(ideas);
    } catch (err) {
        console.error("Error fetching all ideas:", err);
        res.status(500).json({ message: 'Server error fetching ideas. Please try again later.' });
    }
});

// @route   POST /api/ideas/submit
// @desc    Submit a new idea
// @access  Public (as per current frontend and server.js setup)
router.post('/submit', async (req, res) => {
    // Destructure fields from req.body.
    // Note: qrCodeUrl, cartoonImageUrl, cardNumber are not currently sent from frontend's SubmitIdea.js
    // You might integrate these later if you generate them on the backend or send them from frontend.
    const { title, description, submittedBy } = req.body;

    if (!title || !description || !submittedBy) {
        return res.status(400).json({ message: 'Title, description, and your name are required fields.' });
    }

    try {
        const newIdea = new Idea({
            title,
            description,
            submittedBy,
            interestCount: 0, // Initialize interestCount to 0 for a new idea
            // The frontend is responsible for constructing the QR code URL, so we don't store it here
            // unless the backend was also generating the QR code.
            // qrCodeUrl: qrCodeUrl || '',
            // cartoonImageUrl: cartoonImageUrl || '',
            // cardNumber: cardNumber || ''
        });

        const savedIdea = await newIdea.save();
        res.status(201).json({
            message: 'Idea submitted successfully!',
            ideaId: savedIdea._id // This is crucial for your QR code generation on the frontend
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
// @access  Public (as per current frontend)
router.post('/:id/interest', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found.' });
        }
        idea.interestCount++; // Increment the count
        await idea.save(); // Save the updated idea
        res.status(200).json({
            success: true,
            message: 'Interest registered successfully!',
            interestCount: idea.interestCount // Return the new count
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