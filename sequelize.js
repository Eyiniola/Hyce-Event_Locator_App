const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hyce_events', 'root', 'Imthehycetomi17', {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4',  // Fix encoding issues
        connectTimeout: 10000
    },
    logging: false
});

const db = {};  // ✅ Define db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;  // ✅ Export db correctly
