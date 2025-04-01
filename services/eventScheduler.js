const moment = require('moment');
const Event = require('../models/event');
const Notification = require('../models/notification');
const { queueNotification } = require('./notificationService');


async function scheduleEventNotifications() {
    const upcomingEvents = await Event.findAll({
        where: {
            eventDateTime: { $gte: moment().add(1, 'hour').toDate() }
        }
    });

    for (const event of upcomingEvents) {
        const message = 'Reminder: ${event.title} is happening soon!';

        for ( const userId of users) {
            await Notification.create({ userId, eventId: event.eventId, message, status: 'pending' });
            await queueNotification(userId, message, 30 * 60 * 1000);
        }
    }
}

module.exports = scheduleEventNotifications;