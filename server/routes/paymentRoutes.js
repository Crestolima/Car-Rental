const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { processPayment } = require('../controllers/paymentController');

router.post('/pay', protect, processPayment);

module.exports = router;