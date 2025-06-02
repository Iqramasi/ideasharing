const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables to access process.env.JWT_SECRET

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token'); // Conventionally sent in 'x-auth-token' header

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        // Verify token
        // This will throw an error if the token is invalid or expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user object from token payload to the request object
        // So route handlers can access req.user (e.g., req.user.id, req.user.name, req.user.email)
        req.user = decoded.user; // Assuming your JWT payload has a 'user' key with user data
        next(); // Move to the next middleware/route handler
    } catch (err) {
        // If token is invalid or expired
        res.status(401).json({ message: 'Token is not valid.' });
    }
};