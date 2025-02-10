const express = require('express');
const { protect, user } = require('../middleware/auth');
const { createBooking, processPayment, getBookings } = require('../controllers/bookingController');

const router = express.Router();

router.post('/booking', protect, user, createBooking);
router.post('/:bookingId/payment', protect, user, processPayment);
router.get('/:userId', protect, user, getBookings);

module.exports = router;
