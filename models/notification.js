const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const Notification = sequelize.define('Notification', {
    notificationId: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' } // Assuming a User model exists
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Events', key: 'eventId' } // Assuming an Event model exists
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('sent', 'pending', 'failed'),
        defaultValue: 'pending'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Notification;