const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');

const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');

const connectDB = require('./config/db');

const swaggerDocs = require('./config/swagger');

const errorMiddleware = require('./middleware/errorMiddleware');


dotenv.config();

// Connect DB
connectDB();

// Passport config
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 8181;

// Middleware
app.use(cors());
app.use(express.json());

// Session

app.set('trust proxy', 1);


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        cookie: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        }

    })
); 

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);


// Swagger Documentation
swaggerDocs(app);

// Home Route
app.get('/', (req, res) => {
    res.send('Home Services Application API Running');
});


// GitHub OAuth
app.get(
    '/auth/github',
    passport.authenticate('github', {
        scope: ['user:email']
    })
);

// GitHub Callback
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
    if (!req.isAuthenticated?.()) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    res.json(req.user);
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global Error Handler
app.use(errorMiddleware);

// Start Server

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});