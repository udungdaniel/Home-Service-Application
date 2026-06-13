const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in with GitHub.'
    });
};

module.exports = authMiddleware;