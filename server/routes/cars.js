const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multerConfig');
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

router.route('/')
  .get(getCars) // Public route: Anyone can view cars
  .post(protect, authorize('admin'), upload.array('images', 5), createCar); // Only admins can add cars

router.route('/:id')
  .get(getCarById) // Public route: Anyone can view a specific car
  .put(protect, authorize('admin'), upload.array('images', 5), updateCar) // Only admins can update
  .delete(protect, authorize('admin'), deleteCar); // Only admins can delete

module.exports = router;
