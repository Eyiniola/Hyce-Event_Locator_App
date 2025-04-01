const notificationQueue = require('./notificationQueue');
const Notification = require('../models/notification');

const queueNotification = async (userId, message) => {
    try {
        if (!userId || !eventId || !message) {
            throw new Error('Missing required fields: userId, eventId, or message');
        }
        await notificationQueue.add({ userId, eventId, message }); // Add job to queue
        console.log(`Notification queued for User ${userId}: ${message}`);
    } catch (error) {
        console.error('Error queuing notification:', error);
    }
};

const sendNotification = async (data) => {
    try {
        if (!data.userId || !data.eventId || !data.message) {
            throw new Error('Missing required fields in sendNotification');
        }

        console.log(`Sending notification to User ${data.userId}: ${data.message}`);

        // Store in database
        await Notification.create({
            userId: data.userId,
            eventId: data.eventId,
            message: data.message,
            status: 'sent',
        });

        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { queueNotification, sendNotification }; 
