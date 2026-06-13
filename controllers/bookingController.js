const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { customerId, serviceId, bookingDate, totalPrice, notes } = req.body;

        // Fetch service to verify existence and get the correct price
        const service = await Service.findById(serviceId);
        if (!service) { 
            return res.status(404).json({ message: 'Service not found' });
        }

        const newBooking = new Booking({
            customerId,
            serviceId,
            bookingDate,
            totalPrice,
            notes
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. Get all bookings (with referenced data populated) 
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('customerId', 'name email').populate('serviceId', 'name description price');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get a bookings for a specific customer
exports.getBookingsByCustomer = async (req, res) => {
    try {
        const bookings = await Booking.find({ customerId: req.params.customerId })
            .populate('serviceId', 'serviceName price');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Update booking status (e.g., confirm, cancel, complete)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
                 
                 