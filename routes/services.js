const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Service = require('../models/Service');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

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
router.get('/', async (req, res) => {
    try {
        const services = await Service.find()
            .populate('providerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: services
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
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
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service found
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Service not found
 */
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
        }

        const service = await Service.findById(req.params.id)
            .populate('providerId', 'name email');

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        const service = await Service.create({
            providerId: req.user._id,
            serviceName: req.body.serviceName,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            availability: req.body.availability,
            rating: req.body.rating,
            imageUrl: req.body.imageUrl
        });

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: service
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service updated successfully
 */
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
        }

        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // ownership check
        if (service.providerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this service'
            });
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: updatedService
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
        }

        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // ownership check
        if (service.providerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this service'
            });
        }

        await Service.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;