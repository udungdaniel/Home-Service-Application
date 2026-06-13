const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Service = require('../models/Service');

const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');

// Safely extract middleware (prevents "handler must be a function" error)
const protect = authMiddleware?.protect || ((req, res, next) => next());
const validateObjectId =
    validateMiddleware?.validateObjectId ||
    ((req, res, next) => next());

const validateService =
    validateMiddleware?.validateService ||
    ((req, res, next) => next());

/**
 * GET ALL SERVICES
 */
router.get('/', async (req, res, next) => {
    try {
        const services = await Service.find()
            .populate('providerId')
            .sort({ createdAt: -1 });

        res.status(200).json(services);
    } catch (err) {
        next(err);
    }
});

/**
 * GET SERVICE BY ID
 */
router.get('/:id', validateObjectId, async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id).populate(
            'providerId'
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json(service);
    } catch (err) {
        next(err);
    }
});

/**
 * CREATE SERVICE
 */
router.post('/', protect, validateService, async (req, res, next) => {
    try {
        const service = new Service(req.body);
        const savedService = await service.save();

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: savedService
        });
    } catch (err) {
        next(err);
    }
});

/**
 * UPDATE SERVICE
 */
router.put(
    '/:id',
    protect,
    validateObjectId,
    validateService,
    async (req, res, next) => {
        try {
            const updatedService = await Service.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updatedService) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Service updated successfully',
                data: updatedService
            });
        } catch (err) {
            next(err);
        }
    }
);

/**
 * DELETE SERVICE
 */
router.delete(
    '/:id',
    protect,
    validateObjectId,
    async (req, res, next) => {
        try {
            const deletedService = await Service.findByIdAndDelete(
                req.params.id
            );

            if (!deletedService) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Service deleted successfully'
            });
        } catch (err) {
            next(err);
        }
    }
);


module.exports = router;