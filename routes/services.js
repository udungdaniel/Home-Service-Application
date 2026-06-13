const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Service = require('../models/Service');

const { protect } = require('../middleware/authMiddleware');
const {
    validateObjectId,
    validateService
} = require('../middleware/validateMiddleware');

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management endpoints
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 *       500:
 *         description: Server error
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
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB Service ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service found
 *       400:
 *         description: Invalid service ID
 *       404:
 *         description: Service not found
 */
router.get('/:id', validateObjectId, async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('providerId');

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
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *           example:
 *             providerId: "6846b0b1d4f2e1a7f1234567"
 *             serviceName: Plumbing Repair
 *             category: Plumbing
 *             description: Professional plumbing services
 *             price: 15000
 *             availability: true
 *             rating: 4.5
 *             imageUrl: https://example.com/plumber.jpg
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Invalid service data
 *       401:
 *         description: Authentication required
 */
router.post(
    '/',
    protect,
    validateService,
    async (req, res, next) => {
        try {
            const service = new Service({
                providerId: req.body.providerId,
                serviceName: req.body.serviceName,
                category: req.body.category,
                description: req.body.description,
                price: req.body.price,
                availability: req.body.availability,
                rating: req.body.rating,
                imageUrl: req.body.imageUrl
            });

            const savedService = await service.save();

            res.status(201).json({
                success: true,
                message: 'Service created successfully',
                data: savedService
            });

        } catch (err) {
            next(err);
        }
    }
);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB Service ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *           example:
 *             serviceName: Electrical Installation
 *             category: Electrical
 *             description: Home electrical wiring
 *             price: 25000
 *             availability: true
 *             rating: 4.8
 *             imageUrl: https://example.com/electrical.jpg
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       400:
 *         description: Invalid service ID or data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Service not found
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
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB Service ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       400:
 *         description: Invalid service ID
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Service not found
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