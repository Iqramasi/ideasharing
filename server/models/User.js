const mongoose =
require('mongoose');

const UserSchema =
new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },





    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },





    password: {
        type: String,
        required: true
    },





    // OTP

    otp: {
        type: String,
        default: null
    },





    // OTP Expiry

    otpExpires: {
        type: Date,
        default: null
    },





    // EMAIL VERIFIED

    isVerified: {
        type: Boolean,
        default: false
    }

}, {

    timestamps: true
});

module.exports =
mongoose.model(
    'User',
    UserSchema
);