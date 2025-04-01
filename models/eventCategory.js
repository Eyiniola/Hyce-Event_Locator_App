// this is a join table for events and categories to define their many to many relationship

const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');


const EventCategory = sequelize.define('EventCategory', {
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Events', key: 'eventId' },
        onDelete: 'CASCADE'
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Categories', key: 'categoryId' },
        onDelete: 'CASCADE'
    }, 
        
   
    
});

module.exports = EventCategory;