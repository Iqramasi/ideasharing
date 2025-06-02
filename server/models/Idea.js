
// const mongoose = require('mongoose');

// const IdeaSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     // This 'submittedBy' field must match the name you're sending from the frontend
//     submittedBy: {
//         type: String,
//         required: true
//     },
//     interestCount: {
//         type: Number,
//         default: 0 // Initialize to 0, as you're incrementing it in the backend
//     },
//     // These fields are included in your backend, make sure they are in the schema
//     qrCodeUrl: {
//         type: String,
//         default: ''
//     },
//     cartoonImageUrl: {
//         type: String,
//         default: ''
//     },
//     cardNumber: {
//         type: String,
//         default: ''
//     },
//     createdAt: { // Useful for sorting ideas by submission time
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Idea', IdeaSchema);




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