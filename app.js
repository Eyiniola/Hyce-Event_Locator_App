const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const i18next = require('i18next');
const Middleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const sequelize = require('./sequelize').sequelize;
const mysql = require('mysql2');

// Connecting to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Imthehycetomi17',
    database: 'hyce_events'
});

connection.connect((err) => {
    if (err) {
        console.error('Error Connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MYSQL database succesfully');
}); 


//Internationalization setup

i18next.use(Backend).use(Middleware.LanguageDetector).init({
    fallbacking: 'en',
    preload: ['en', 'fr'], // Preload languages
    backend: {
        loadPath:  './locales/{{lng}}/translation.json', // Load translations from files
      },
    detection: {
        order: ["querystring", "cookie",  "header"], // Detect language from URL, cookies, or headers
        caches: ["cookie"],
        lookupCookie: "i18next",
        lookupHeader: "accept-language",
        lookupQuerystring: "lng",
    },
    //debug: true,
    supportedLngs: ['en', 'fr'],
    nonExplicitSupportedLngs: true,
}); 

const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Middleware.handle(i18next));
app.use((req, res, next) => {
    if (!['en', 'fr'].includes(req.language)) {
        req.language = 'en';  // Default to 'en' if 'dev' or unsupported language is detected
    }
    next();
});


// Home route
app.get('/', (req, res) => {
    //const language = req.query.lng || 'en';
    console.log("Detected language:", req.language);
    res.json({ message: req.t('message')});
});


// API Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);
//const authRoutes = require('./routes/authRoutes');
//app.use('/api/auth', authRoutes);

//Sync database

sequelize.authenticate().then(() => {
    console.log('Database connected...');
    return sequelize.sync();
}).then(() => console.log('Models synchronized...')).catch(err => console.log('Eroor connecting to database', err));


// Error handling middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error'});
});

// Starting the server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
