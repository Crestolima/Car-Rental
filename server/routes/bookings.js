// routes/bookings.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');
const {
  createBooking,
  getBookings,
  updateBookingStatus
} = require('../controllers/bookingController');

// Route to create a booking and get all bookings for the user
router.route('/')
  .post(protect, validateBooking, createBooking)  // Protect the route and validate the booking data
  .get(protect, getBookings);  // Protect the route for getting all bookings for the authenticated user

// Route to update booking status by booking ID
router.route('/:id/status')
  .put(protect, updateBookingStatus);  // Protect the route for updating booking status

module.exports = router;
