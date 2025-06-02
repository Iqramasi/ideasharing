const jwt = require('jsonwebtoken');
require('dotenv').config();

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

        // Attach user ID from token payload to the request object
        // So route handlers can access req.user.id
        req.user = decoded;
        next(); // Move to the next middleware/route handler
    } catch (err) {
        // If token is invalid or expired
        res.status(401).json({ message: 'Token is not valid.' });
    }
};