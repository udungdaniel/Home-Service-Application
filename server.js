const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8181;

// Middleware
app.use(cors());
app.use(express.json());

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'homeservicessecret',
        resave: false,
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
app.get('/', (req, res) => {
    res.send('Home Services Application API Running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});