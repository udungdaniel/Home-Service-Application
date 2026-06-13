const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management endpoints
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customerId", "name email")
      .populate("serviceId", "serviceName price");

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking found
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Booking not found
 */
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("customerId", "name email")
      .populate("serviceId", "serviceName price");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - serviceId
 *               - bookingDate
 *               - totalPrice
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: "64a1f2c9d8b3a1e2f1234567"
 *               serviceId:
 *                 type: string
 *                 example: "64a1f2c9d8b3a1e2f7654321"
 *               bookingDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-13T10:00:00Z"
 *               totalPrice:
 *                 type: number
 *                 example: 100
 *               notes:
 *                 type: string
 *                 example: "Please arrive on time"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Service not found
 */
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { customerId, serviceId, bookingDate, totalPrice, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const booking = new Booking({
      customerId,
      serviceId,
      bookingDate,
      totalPrice,
      notes,
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: savedBooking,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update booking status
 *     tags: [Bookings]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Booking updated successfully
 */
router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const deleted = await Booking.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
