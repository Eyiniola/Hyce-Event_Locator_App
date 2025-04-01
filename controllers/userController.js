const { User, Event } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fb09d9843e4c9c25a9299f3990fb41d56ff9e2f94a680292fe489f8a2ec235b93bf709966280f8e600419a9ed11bdead640438a575a0f5f5a00e3754c49def9a';

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password, language, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            email,
            passwordHash, // Store the hashed password
            language,
            role
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token

        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};


// Get user preferencies (categories)
exports.getUserPreferences = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { include: 'preferences'});
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.preferences);
    } catch (error) {
        res.status(500).json({ mesage: 'Error fetching preference', error });
    }
};

// Update user location
exports.updateLocation = async (req, res) => {
    try {
        const { location } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.location = location;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update location', error });
    }
};


// Add an event to a user's favourites
exports.addFavoriteEvent = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        const event = await Event.findByPk(req.params.eventId);

        if (!user || !event) return res.status(404).json({ message: 'User or Event not found' });

        await user.addFavorites(event, { through: { userId: user.id, eventId: event.id } }); 
        res.json( {message: 'Event added to  favorites'})
    } catch (error) {
        console.error('Error adding favorite:', error.message || error);
        res.status(500).json({ message: 'Failed to add favorites', error })
    }
};

exports.getFavoriteEvent = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, { include: 'favorites' });
        if (!user) return res.status(404).json({ message: 'User not found'});
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch favorites', error })
    }
};


// Remove an event from favorites
exports.removeFavoriteEvent = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        const event = await Event.findByPk(req.params.eventId);

        if (!user || !event) return res.status(404).json({ message: 'User or Event not found', err});

        await user.removeFavorites(event);
        res.json({ message: 'Event removed from favorites' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to remove favorite', error });
    }
};


// Update User info
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user information
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update user', error });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
};