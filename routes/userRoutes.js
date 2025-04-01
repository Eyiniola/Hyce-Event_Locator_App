const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware')

// User routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes (auth required)
router.get('/:id/preferences', authenticateUser, UserController.getUserPreferences);
router.put('/:id/location', authenticateUser, UserController.updateLocation);
router.put('/:userId', authenticateUser, UserController.updateUser);
router.delete('/:userId', authenticateUser, UserController.deleteUser);

// Favorite Events
router.post('/:userId/favorites/:eventId', authenticateUser, UserController.addFavoriteEvent);
router.get('/:userId/favorites', authenticateUser, UserController.getFavoriteEvent);
router.delete('/:userId/favorites/:eventId', authenticateUser, UserController.removeFavoriteEvent);

module.exports = router;
