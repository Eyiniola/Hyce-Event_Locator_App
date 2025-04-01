const Queue = require('bull');

// Create a Bull queue
const notificationQueue = new Queue('notifications', {
    redis: {
        host: 'localhost',
        port: 6379
    }
});

// Process notifications in the queue
notificationQueue.process(async (job) => {
    try {
        console.log(`Sending notification to User ${job.data.userId}...`);

        // Lazy import to prevent circular dependency
        const { queueNotification, sendNotification } = require('./notificationService');
        
        await sendNotification(job.data);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
});

module.exports = notificationQueue;
