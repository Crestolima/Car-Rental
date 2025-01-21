const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

router.route('/')
  .get(getCars)
  .post(protect, admin, createCar);

router.route('/:id')
  .get(getCarById)
  .put(protect, admin, updateCar)
  .delete(protect, admin, deleteCar);

module.exports = router;