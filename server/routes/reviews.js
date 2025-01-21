const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');
const { createReview, getCarReviews } = require('../controllers/reviewController');

router.post('/', protect, validateReview, createReview);
router.get('/car/:carId', getCarReviews);

module.exports = router;