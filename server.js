const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');

const connectDB = require('./config/db');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');

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

<<<<<<< HEAD
=======
// Session
>>>>>>> 75c6108a8af99525d49e4d7b64c889e21e33702f
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
<<<<<<< HEAD
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Home Route
=======
        saveUninitialized: false,
        cookie: { secure: false }
    })
);

// Swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile, {
        explorer: true
    })
);

// Routes
app.use('/users', userRoutes);
app.use('/services', serviceRoutes);

// Health route
/**
 * #swagger.tags = ['Health']
 * #swagger.summary = 'API Health Check'
 */
>>>>>>> 75c6108a8af99525d49e4d7b64c889e21e33702f
app.get('/', (req, res) => {
    res.send('Home Services Application API Running');
});

<<<<<<< HEAD
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

=======
// Start server
>>>>>>> 75c6108a8af99525d49e4d7b64c889e21e33702f
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});