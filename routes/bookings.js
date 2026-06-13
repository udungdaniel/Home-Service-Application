const express = require(express);
const router = express(Router);

const {
    createBooking,
    getAllBookings,
    getCustomerBookings,
    updateBookingStatus
} = require('../controllers/bookingController');

/**
 * #swagger.tags = ['Bookings]
 * #swagger.summary = 'Create a new booking'
 */
router.post('/', createBooking);

/** 
 * #swagger.tags = ['Bookings]
 * #swagger.summary = 'Get all bookings'  
 */
router.post('/', getAllBookings);

/**
 * #swagger.tags = ['Bookings']
 * #swagger.summary = 'Get bookings for a specific customer'
 */
router.get('/customer/:customerId', getCustomerBookings);

/**
 * #swagger.tags = ['Bookings']
 * #swagger.summary = 'Update booking status'
 */
router.patch('/:id', updateBookingStatus);

module.exports = router;
