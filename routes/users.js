const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

/**
 * #swagger.tags = ['Users']
 * #swagger.summary = 'Get all users'
 */
router.get('/', getAllUsers);

/**
 * #swagger.tags = ['Users']
 * #swagger.summary = 'Get user by ID'
 */
router.get('/:id', getUserById);

/**
 * #swagger.tags = ['Users']
 * #swagger.summary = 'Create a new user'
 */
router.post('/', createUser);

/**
 * #swagger.tags = ['Users']
 * #swagger.summary = 'Update a user'
 */
router.put('/:id', updateUser);

/**
 * #swagger.tags = ['Users']
 * #swagger.summary = 'Delete a user'
 */
router.delete('/:id', deleteUser);

module.exports = router;