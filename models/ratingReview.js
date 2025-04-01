const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const RatingReview = sequelize.define('RatingReview', {
    reviewid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false, validate: { min: 1, max: 5 }
    },
    comment: { type: DataTypes.TEXT }
});


module.exports = RatingReview;