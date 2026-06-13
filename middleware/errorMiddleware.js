const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(
                (error) => error.message
            )
        });
    }

    // Invalid MongoDB ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    // Duplicate key errors (e.g., unique email)
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate field value entered',
            field: Object.keys(err.keyValue)[0]
        });
    }

    // Default server error
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorMiddleware;