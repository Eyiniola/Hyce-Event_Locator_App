const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// Public events routes
router.get('/', EventController.getAllEvents);
router.get('/events', EventController.getEventsByCategory); 
router.get('/location', EventController.searchEventsByLocation);
router.get('/:id', EventController.getEventById);

// Protected events routes (user auth required)
router.post('/', authenticateUser, authorizeRoles('user', 'admin'), EventController.createEvent);

// Update and delete events (admin auth required)
router.put('/:id', authenticateUser, authorizeRoles('admin'), EventController.updateEvent);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), EventController.deleteEvent);

module.exports = router;