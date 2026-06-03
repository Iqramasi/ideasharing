const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
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

    submittedByEmail: {
        type: String,
        default: ''
    },

    userId: {
        type: String,
        required: true
    },

    interestedUsers: [
        {
            type: String
        }
    ],

    qrCodeUrl: {
        type: String,
        default: ''
    },

    cartoonImageUrl: {
        type: String,
        default: ''
    },

    cardNumber: {
        type: String,
        default: ''
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
    mongoose.model(
        'Idea',
        IdeaSchema
    );