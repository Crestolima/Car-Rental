const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');
const {
  createBooking,
  getBookings,
  updateBookingStatus
} = require('../controllers/bookingController');

router.route('/')
  .post(protect, validateBooking, createBooking)
  .get(protect, getBookings);

router.route('/:id/status')
  .put(protect, updateBookingStatus);

module.exports = router;
