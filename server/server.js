


// require('dotenv').config(); // Load environment variables from .env file

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs'); // For password hashing
// const jwt = require('jsonwebtoken'); // For JSON Web Tokens

// const app = express();
// const PORT = process.env.PORT || 5000;

// // --- Middleware ---
// app.use(cors()); // Enable CORS for all routes (important for frontend communication)
// app.use(express.json()); // Body parser for JSON request bodies

// // --- MongoDB Connection ---
// // Ensure process.env.MONGO_URI is set in your .env file
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB connected successfully!'))
// .catch(err => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1); // Exit process with failure if DB connection fails
// });

// // --- In-Memory "Database" for Users ---
// // IMPORTANT: In a real production application, you would store users in MongoDB
// // by creating a Mongoose User Schema and Model. This in-memory array will reset
// // every time the server restarts, so new registrations will be lost.
// let users = []; // Stores user objects: { id, name, email, password (hashed) }
// let nextUserId = 1; // Simple ID counter for in-memory users

// // --- JWT Secret ---
// // Get a strong, random secret from your .env file.
// // You can generate one with: require('crypto').randomBytes(64).toString('hex')
// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//     console.error("FATAL ERROR: JWT_SECRET is not defined in .env file!");
//     process.exit(1); // Exit if secret is missing
// }

// // ===========================================
// //  AUTHENTICATION ROUTES (/api/auth/...)
// // ===========================================

// // @route   POST /api/auth/register
// // @desc    Register a new user
// // @access  Public
// app.post('/api/auth/register', async (req, res) => {
//     const { name, email, password } = req.body;

//     // Basic validation
//     if (!name || !email || !password) {
//         return res.status(400).json({ message: 'Please enter all fields: name, email, and password.' });
//     }
//     if (password.length < 6) {
//         return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
//     }

//     try {
//         // Check if user with this email already exists in our in-memory store
//         let userExists = users.find(user => user.email === email);
//         if (userExists) {
//             return res.status(400).json({ message: 'User with this email already exists.' });
//         }

//         // Hash the password
//         const salt = await bcrypt.genSalt(10); // Generate a salt
//         const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

//         // Create new user object
//         const newUser = {
//             id: nextUserId++, // Assign unique ID
//             name,
//             email,
//             password: hashedPassword // Store the hashed password
//         };
//         users.push(newUser); // Add to in-memory store

//         // Prepare payload for JWT (DO NOT include the hashed password in the payload)
//         const payload = {
//             user: {
//                 id: newUser.id,
//                 name: newUser.name,
//                 email: newUser.email
//             }
//         };

//         // Sign the JSON Web Token
//         jwt.sign(
//             payload,
//             JWT_SECRET,
//             { expiresIn: '1h' }, // Token expires in 1 hour
//             (err, token) => {
//                 if (err) throw err; // If there's an error signing, throw it
//                 res.status(201).json({ // 201 Created status
//                     message: 'Account created successfully!',
//                     token, // Send the token
//                     user: payload.user // Send user data back to frontend for display
//                 });
//             }
//         );

//     } catch (err) {
//         console.error("Error during user registration:", err.message);
//         res.status(500).send('Server error during registration. Please try again.');
//     }
// });

// // @route   POST /api/auth/login
// // @desc    Authenticate user & get token
// // @access  Public
// app.post('/api/auth/login', async (req, res) => {
//     const { email, password } = req.body;

//     // Basic validation
//     if (!email || !password) {
//         return res.status(400).json({ message: 'Please enter both email and password.' });
//     }

//     try {
//         // Find user by email in our in-memory store
//         let user = users.find(u => u.email === email);
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid credentials.' });
//         }

//         // Compare provided password with stored hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials.' });
//         }

//         // Prepare payload for JWT (DO NOT include the hashed password in the payload)
//         const payload = {
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email
//             }
//         };

//         // Sign the JSON Web Token
//         jwt.sign(
//             payload,
//             JWT_SECRET,
//             { expiresIn: '1h' }, // Token expires in 1 hour
//             (err, token) => {
//                 if (err) throw err;
//                 res.json({ // 200 OK status is default for res.json
//                     message: 'Logged in successfully!',
//                     token, // Send the token
//                     user: payload.user // Send user data back to frontend for display
//                 });
//             }
//         );

//     } catch (err) {
//         console.error("Error during user login:", err.message);
//         res.status(500).send('Server error during login. Please try again.');
//     }
// });

// // ===========================================
// //  IDEA ROUTES (/api/ideas/...)
// // ===========================================
// // Import the idea routes and authentication middleware
// const ideaRoutes = require('./routes/ideaRoutes');
// const auth = require('./middleware/authMiddleware');

// // Mount the idea routes.
// // Currently, all idea routes are public as per your frontend's interaction.
// // If you wanted to protect specific routes (e.g., only logged-in users can submit):
// // router.post('/submit', auth, async (req, res) => { ... });
// // But for now, they are public as they don't have 'auth' middleware applied here.
// app.use('/api/ideas', ideaRoutes);


// // Start the server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// server.js

// --- 1. Imports ---
require('dotenv').config(); // Load environment variables from .env file (for local testing)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JSON Web Tokens

const app = express();
const PORT = process.env.PORT || 5000;

// --- 2. Environment Variables (Critical for Render Deployment) ---
// Ensure these are set in your Render service's Environment Variables!
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET; // Use a strong, random string in production!

// Vercel Frontend URL(s) - REPLACE WITH YOUR ACTUAL VERCEL DEPLOYMENT URL(S)
// Get your Vercel production domain from your Vercel project settings.
const VERCEL_FRONTEND_URL = 'https://your-vercel-frontend-app.vercel.app'; // e.g., https://share-idea-app.vercel.app
// If you use Vercel preview deployments, you might want to allow a pattern for them too:
const VERCEL_PREVIEW_URL_PATTERN = /^https:\/\/your-vercel-frontend-app-git-[a-zA-Z0-9-]+-yourusername\.vercel\.app$/; // Adjust this regex to match your specific Vercel preview URLs

// --- 3. Middleware ---

// Configure CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps/file:// for some cases, or curl requests)
        // Allow your specific Vercel production URL
        // Allow Vercel preview URLs (if they match the pattern)
        // Allow localhost for local development
        if (!origin ||
            origin === VERCEL_FRONTEND_URL ||
            VERCEL_PREVIEW_URL_PATTERN.test(origin) ||
            origin === 'http://localhost:3000' // For local frontend development
        ) {
            callback(null, true);
        } else {
            console.warn(`CORS: Blocking request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent (if applicable)
    allowedHeaders: 'Content-Type,Authorization,x-auth-token', // Explicitly allow custom headers
};
app.use(cors(corsOptions)); // Apply CORS middleware

app.use(express.json()); // Body parser for JSON request bodies


// --- 4. Database Connection ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure if DB connection fails
    });


// --- 5. Mongoose Models ---

// User Model (for authentication and storing users in MongoDB)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will store the hashed password
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);


// Idea Model (for storing ideas in MongoDB)
const IdeaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    submittedBy: { type: String, required: true }, // Name provided by the user
    submittedByEmail: { type: String, required: true }, // Email of the logged-in user who submitted
    interestCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    // You could link this to a User ID if you want to explicitly track which registered user submitted an idea
    // creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Idea = mongoose.model('Idea', IdeaSchema);


// --- 6. JWT Authentication Middleware ---
// This middleware will protect your routes that require a logged-in user.
function authMiddleware(req, res, next) {
    // Get token from header (from the 'x-auth-token' custom header in frontend)
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user; // Attach the user payload (id, name, email) to the request
        next(); // Continue to the next middleware/route handler
    } catch (e) {
        // If token is invalid (expired, malformed, etc.)
        res.status(401).json({ message: 'Token is not valid' });
    }
}


// --- 7. API Routes ---

// ===========================================
// AUTHENTICATION ROUTES (/api/auth/...)
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
        // Check if user with this email already exists in MongoDB
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create new user using Mongoose Model
        const newUser = new User({
            name,
            email,
            password: hashedPassword // Store the hashed password
        });
        await newUser.save(); // Save user to MongoDB

        // Prepare payload for JWT (DO NOT include the hashed password in the payload)
        const payload = {
            user: {
                id: newUser.id, // Mongoose generates ._id, which can be accessed as .id
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
        console.error("Error during user registration:", err.message);
        res.status(500).send('Server error during registration. Please try again.');
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
        // Find user by email in MongoDB
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Prepare payload for JWT
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
        console.error("Error during user login:", err.message);
        res.status(500).send('Server error during login. Please try again.');
    }
});


// ===========================================
// IDEA ROUTES (/api/ideas/...)
// ===========================================

// @route   POST /api/ideas/submit
// @desc    Submit a new idea
// @access  Private (User must be logged in)
app.post('/api/ideas/submit', authMiddleware, async (req, res) => {
    const { title, description, submittedBy } = req.body;

    // Basic validation
    if (!title || !description || !submittedBy) {
        return res.status(400).json({ message: 'Please enter all required fields: Title, Description, and Submitted By.' });
    }

    try {
        const newIdea = new Idea({
            title,
            description,
            submittedBy,
            submittedByEmail: req.user.email // Get email from the authenticated user (from JWT payload)
            // If you added creatorId to IdeaSchema and want to link, uncomment below:
            // creatorId: req.user.id
        });
        const savedIdea = await newIdea.save();
        res.status(201).json({
            message: 'Idea submitted successfully!',
            ideaId: savedIdea._id,
            idea: savedIdea
        });
    } catch (err) {
        console.error("Error submitting idea:", err.message);
        res.status(500).send('Server error during idea submission.');
    }
});

// @route   GET /api/ideas
// @desc    Get all ideas
// @access  Public (anyone can view ideas)
app.get('/api/ideas', async (req, res) => {
    try {
        const ideas = await Idea.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json(ideas);
    } catch (err) {
        console.error("Error fetching ideas:", err.message);
        res.status(500).send('Server error fetching ideas.');
    }
});

// @route   GET /api/ideas/:id
// @desc    Get a single idea by ID
// @access  Public
app.get('/api/ideas/:id', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found.' });
        }
        res.json(idea);
    } catch (err) {
        console.error("Error fetching single idea:", err.message);
        if (err.kind === 'ObjectId') { // Handle cases where ID format is wrong
            return res.status(400).json({ message: 'Invalid Idea ID format.' });
        }
        res.status(500).send('Server error fetching idea.');
    }
});

// @route   POST /api/ideas/:id/interest
// @desc    Register interest for an idea (increment interestCount)
// @access  Public (or private if you want only logged-in users to show interest)
app.post('/api/ideas/:id/interest', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found.' });
        }

        idea.interestCount = (idea.interestCount || 0) + 1;
        await idea.save();
        res.json({ message: 'Interest registered successfully!', newCount: idea.interestCount });
    } catch (err) {
        console.error("Error registering interest:", err.message);
        res.status(500).send('Server error registering interest.');
    }
});


// --- 8. Server Listening ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));