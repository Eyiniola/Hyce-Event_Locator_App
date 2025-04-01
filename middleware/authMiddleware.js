const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const token = authHeader.replace("Bearer ", "").trim();
        console.log('Token:', token);  // Log the token to check if it's passed correctly
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store full decoded token (includes user ID and role)
        console.log('Decoded Token:', req.user);
        console.log(new Date().toISOString()); // Logs current date in ISO format, UTC

        next();
    } catch (error) {
        console.log('Token Verification Error:', error);
        res.status(401).json({ message: 'Invalid token', error });
    }
};

// Role-Based Access Control (RBAC)
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRoles };
