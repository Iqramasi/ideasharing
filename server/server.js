require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JSON Web Tokens

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes (important for frontend communication)
app.use(express.json()); // Body parser for JSON request bodies

// --- MongoDB Connection ---
// Ensure process.env.MONGO_URI is set in your .env file
mongoose.connect(process.env.MONGO_URI, {
    // The following options are deprecated and no longer necessary in recent Mongoose versions.
    // Keeping them might lead to warnings, so it's better to remove them.
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure if DB connection fails
});

// --- In-Memory "Database" for Users ---
// IMPORTANT: In a real production application, you would store users in MongoDB
// by creating a Mongoose User Schema and Model. This in-memory array will reset
// every time the server restarts, so new registrations will be lost.
let users = []; // Stores user objects: { id, name, email, password (hashed) }
let nextUserId = 1; // Simple ID counter for in-memory users

// --- JWT Secret ---
// Get a strong, random secret from your .env file.
// You can generate one with: require('crypto').randomBytes(64).toString('hex')
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file!");
    process.exit(1); // Exit if secret is missing
}

// ===========================================
//  AUTHENTICATION ROUTES (/api/auth/...)
// ===========================================

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields: name, email, and password.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        // Check if user with this email already exists in our in-memory store
        let userExists = users.find(user => user.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create new user object
        const newUser = {
            id: nextUserId++, // Assign unique ID
            name,
            email,
            password: hashedPassword // Store the hashed password
        };
        users.push(newUser); // Add to in-memory store

        // Prepare payload for JWT (DO NOT include the hashed password in the payload)
        const payload = {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        };

        // Sign the JSON Web Token
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err; // If there's an error signing, throw it
                res.status(201).json({ // 201 Created status
                    message: 'Account created successfully!',
                    token, // Send the token
                    user: payload.user // Send user data back to frontend for display
                });
            }
        );

    } catch (err) {
        // More descriptive error message for internal server errors
        console.error("Error during user registration:", err.message);
        res.status(500).json({ message: 'Server error during registration. Please try again.' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    try {
        // Find user by email in our in-memory store
        let user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Prepare payload for JWT (DO NOT include the hashed password in the payload)
        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };

        // Sign the JSON Web Token
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ // 200 OK status is default for res.json
                    message: 'Logged in successfully!',
                    token, // Send the token
                    user: payload.user // Send user data back to frontend for display
                });
            }
        );

    } catch (err) {
        // More descriptive error message for internal server errors
        console.error("Error during user login:", err.message);
        res.status(500).json({ message: 'Server error during login. Please try again.' });
    }
});

// ===========================================
//  IDEA ROUTES (/api/ideas/...)
// ===========================================
// Import the idea routes and authentication middleware
const ideaRoutes = require('./routes/ideaRoutes');
// const auth = require('./middleware/authMiddleware'); // Uncomment if you create this middleware

// Mount the idea routes.
// Currently, all idea routes are public as per your frontend's interaction.
// If you wanted to protect specific routes (e.g., only logged-in users can submit):
// app.use('/api/ideas', auth, ideaRoutes); // This would protect all routes in ideaRoutes
// Or protect specific routes within ideaRoutes:
// router.post('/submit', auth, async (req, res) => { ... });
app.use('/api/ideas', ideaRoutes);


// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));