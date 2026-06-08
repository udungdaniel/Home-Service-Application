const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');

const connectDB = require('./config/db');

dotenv.config();

connectDB();

require('./config/passport');

const app = express();
const PORT = process.env.PORT || 8181;

app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);

// Middleware
app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Home Route
app.get('/', (req, res) => {
    res.send('Home Services Application API Running');
});

// Login with GitHub
app.get(
    '/auth/github',
    passport.authenticate('github', {
        scope: ['user:email']
    })
);

// Callback Route
app.get(
    '/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/'
    }),
    (req, res) => {
        res.json({
            success: true,
            user: req.user
        });
    }
);

// Logout
app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json(err);
        }

        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

// Current User
app.get('/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: 'Not authenticated'
        });
    }

    res.json(req.user);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});