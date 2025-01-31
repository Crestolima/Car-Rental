const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../config/multerConfig');
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

router.route('/')
  .get(getCars)
  .post(protect, admin, upload.array('images', 5), createCar);

router.route('/:id')
  .get(getCarById)
  .put(protect, admin, upload.array('images', 5), updateCar)
  .delete(protect, admin, deleteCar);

module.exports = router;