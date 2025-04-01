const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const Event = sequelize.define('Event', {
    eventId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    eventDateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'),
    },
    rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.0},
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Categories',
            key: 'categoryId'
        }
    }

});


module.exports = Event;