const express = require('express');
<<<<<<< HEAD
const mongoose = require('mongoose');
const router = express.Router();

const Service = require('../models/Service');

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
 */
router.get('/', async (req, res) => {
    try {

        const services = await Service.find()
            .populate('providerId')
            .sort({ createdAt: -1 });

        res.status(200).json(services);

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
            .populate('providerId');

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json(service);

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
 */
router.post('/', async (req, res) => {
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
 */
router.put('/:id', async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
        }

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
 */
router.delete('/:id', async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
        }

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
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
=======
const router = express.Router();

const {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');

/**
 * #swagger.tags = ['Services']
 * #swagger.summary = 'Get all services'
 */
router.get('/', getAllServices);

/**
 * #swagger.tags = ['Services']
 * #swagger.summary = 'Get service by ID'
 */
router.get('/:id', getServiceById);

/**
 * #swagger.tags = ['Services']
 * #swagger.summary = 'Create a new service'
 */
router.post('/', createService);

/**
 * #swagger.tags = ['Services']
 * #swagger.summary = 'Update a service'
 */
router.put('/:id', updateService);

/**
 * #swagger.tags = ['Services']
 * #swagger.summary = 'Delete a service'
 */
router.delete('/:id', deleteService);
>>>>>>> 75c6108a8af99525d49e4d7b64c889e21e33702f

module.exports = router;