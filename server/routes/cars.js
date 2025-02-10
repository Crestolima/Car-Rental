const express = require('express');
const { protect, admin } = require('../middleware/auth');
const upload = require('../config/multerConfig');
const { createCar, getCars, getCarById, updateCar, deleteCar } = require('../controllers/carController');

const router = express.Router();

router.get('/', getCars); // ✅ Works for everyone
router.get('/:carId', protect, getCarById); // ✅ Authenticated users can view a specific car

router.post('/', protect, admin, upload.array('images', 5), createCar); // 🔐 Admin only
router.put('/:carId', protect, admin, upload.array('images', 5), updateCar); // 🔐 Admin only
router.delete('/:carId', protect, admin, deleteCar); // 🔐 Admin only

module.exports = router;
