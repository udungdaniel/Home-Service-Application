const mongoose = require('mongoose');

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    next();
};

/**
 * Validate required fields for creating/updating users
 */
const validateUser = (req, res, next) => {
    const {
        name,
        email,
        phone,
        address
    } = req.body;

    if (!name || !email || !phone || !address) {
        return res.status(400).json({
            success: false,
            message:
                'Name, email, phone, and address are required'
        });
    }

    next();
};

/**
 * Validate required fields for creating/updating services
 */
const validateService = (req, res, next) => {
    const {
        serviceName,
        category,
        price
    } = req.body;

    if (!serviceName || !category || price === undefined) {
        return res.status(400).json({
            success: false,
            message:
                'Service name, category, and price are required'
        });
    }

    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
            success: false,
            message:
                'Price must be a valid number greater than or equal to 0'
        });
    }

    next();
};

/**
 * Validate review data
 */
const validateReview = (req, res, next) => {
    const {
        rating,
        comment
    } = req.body;

    if (rating === undefined || !comment) {
        return res.status(400).json({
            success: false,
            message:
                'Rating and comment are required'
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message:
                'Rating must be between 1 and 5'
        });
    }

    next();
};

/**
 * Validate booking data
 */
const validateBooking = (req, res, next) => {
    const {
        serviceId,
        bookingDate,
        location
    } = req.body;

    if (!serviceId || !bookingDate || !location) {
        return res.status(400).json({
            success: false,
            message:
                'Service ID, booking date, and location are required'
        });
    }

    next();
};

module.exports = {
    validateObjectId,
    validateUser,
    validateService,
    validateReview,
    validateBooking
};