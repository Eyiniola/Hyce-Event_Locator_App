const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');
const { queueNotification, sendNotification } = require('../services/notificationService');

router.post('/publish', authenticateUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const { message, userId, eventId } = req.body;
        if (!message || !userId || !eventId) {
            return res.status(400).json({ success: false, message: 'Message and userId are required' });
        }

        await sendNotification({ userId, eventId, message });  

        res.json({ success: true, message: 'Notification published successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error publishing notification', error: error.message });
    }
});

router.get('/user/:userId', authenticateUser, async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']], // Get latest notifications first
        });

        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
    }
});


module.exports = router;