const express = require('express');
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

module.exports = router;