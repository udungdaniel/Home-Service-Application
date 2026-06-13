const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 */
router.get('/:id', async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: Daniel Alfred
 *             email: daniel@example.com
 *             githubId: "12345678"
 *             role: customer
 *             phone: "08012345678"
 *             address: Abuja, Nigeria
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid user data
 *       409:
 *         description: Email already exists
 */
router.post('/', async (req, res) => {
    try {

        const existingUser = await User.findOne({
            email: req.body.email
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            githubId: req.body.githubId,
            role: req.body.role,
            phone: req.body.phone,
            address: req.body.address
        });

        const savedUser = await user.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: savedUser
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
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: Daniel Alfred Updated
 *             email: daniel@example.com
 *             role: artisan
 *             phone: "08012345678"
 *             address: Abuja, Nigeria
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid user ID or data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
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
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 */
router.delete('/:id', async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const deletedUser = await User.findByIdAndDelete(
            req.params.id
        );

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;