


const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends of a string
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    submittedBy: {
        type: String,
        required: true,
        trim: true
    },
    interestCount: {
        type: Number,
        default: 0 // Initialize to 0. It's incremented when the idea is submitted and when interest is registered.
    },
    // These fields are included in your backend for potential future use or display
    qrCodeUrl: {
        type: String,
        default: ''
    },
    cartoonImageUrl: {
        type: String,
        default: ''
    },
    cardNumber: { // If you want to store a unique card number for an idea
        type: String,
        default: ''
    },
    createdAt: { // Automatically adds a timestamp for when the idea was created
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Idea', IdeaSchema);