// this is a join table for users and categories to define their many to many relationship

const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const UserCategory = sequelize.define('Usercategory', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'userId' },
        onDelete: 'CASCADE'
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Categories', key: 'categoryId' },
        onDelete: 'CASCADE'
    },
   
});


module.exports = UserCategory;