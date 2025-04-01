// this is a join table that shows the manay to many relationship between users and events (for favourites)

const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');


const FavouriteEvent = sequelize.define('Favouriteevent', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' },
        onDelete: 'CASCADE'
    },

    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Events', key: 'eventId' },
        onDelete: 'CASCADE'
    },
    
});


module.exports = FavouriteEvent;