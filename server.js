const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8181;

// Middleware
app.use(cors());
app.use(express.json());

// Express Session
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'homeservicessecret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false
        }
    })
);

// Default Route
app.get('/', (req, res) => {
    res.send('Home Services Application API Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
