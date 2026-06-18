const Review = require('../models/Review');


const createReview = async (req, res) => {
    try{
        const review = await Review.create(req.body);

        res.status(200).json(review);
    }catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const getAllReviews = async (req,res) => {
    try{
        const reviews = await Review.find();

        res.status(200).json(reviews);
    }catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const getReviewById = async (req,res) => {
    try{
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }
        res.status(200).json(review);
    }catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const updateReview = async (req,res) => {
    try{
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }
        res.status(200).json(review);
    }catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const deleteReview = async (req, res) => {
    try {

        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        res.status(200).json({
            message: 'Review deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};



module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview
};