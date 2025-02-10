const express = require('express');
const router = express.Router();
const { createTransaction } = require('../controllers/transactionController'); // Correct import
const { protect } = require('../middleware/auth');

// Route to create a transaction (protected)
router.post('/create', protect, createTransaction);

module.exports = router;
