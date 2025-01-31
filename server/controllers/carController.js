const Car = require('../models/Car');
const fs = require('fs').promises;
const path = require('path');

const createCar = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      const error = new Error('No images provided');
      error.statusCode = 400;
      throw error;
    }

    // Process uploaded files
    const imageUrls = req.files.map(file => `/uploads/cars/${file.filename}`);

    let carData = {
      make: req.body.make,
      model: req.body.model,
      year: parseInt(req.body.year),
      type: req.body.type,
      transmission: req.body.transmission,
      pricePerDay: parseFloat(req.body.pricePerDay),
      available: req.body.available === 'true',
      images: imageUrls,
      features: [],
      location: {
        city: '',
        address: '',
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      }
    };

    // Parse features
    if (req.body.features) {
      try {
        carData.features = JSON.parse(req.body.features);
      } catch (e) {
        const error = new Error('Invalid features data');
        error.statusCode = 400;
        throw error;
      }
    }

    // Parse location
    if (req.body.location) {
      try {
        carData.location = JSON.parse(req.body.location);
      } catch (e) {
        const error = new Error('Invalid location data');
        error.statusCode = 400;
        throw error;
      }
    }

    const car = await Car.create(carData);
    res.status(201).json(car);
  } catch (error) {
    // Clean up uploaded files if there's an error
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(err => 
          console.error('Error deleting file:', err)
        );
      }
    }
    next(error); // Pass to error handler
  }
};

const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      throw error;
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      // Delete old images
      for (const imagePath of car.images) {
        const fullPath = path.join(__dirname, '..', 'public', imagePath);
        await fs.unlink(fullPath).catch(err => 
          console.error('Error deleting old image:', err)
        );
      }

      // Add new image paths
      req.body.images = req.files.map(file => `/uploads/cars/${file.filename}`);
    }

    // Parse JSON fields
    if (req.body.features) {
      try {
        req.body.features = JSON.parse(req.body.features);
      } catch (e) {
        const error = new Error('Invalid features data');
        error.statusCode = 400;
        throw error;
      }
    }

    if (req.body.location) {
      try {
        req.body.location = JSON.parse(req.body.location);
      } catch (e) {
        const error = new Error('Invalid location data');
        error.statusCode = 400;
        throw error;
      }
    }

    Object.assign(car, req.body);
    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (error) {
    // Clean up new uploaded files if there's an error
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(err => 
          console.error('Error deleting file:', err)
        );
      }
    }
    next(error); // Pass to error handler
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete associated images
    for (const imagePath of car.images) {
      const fullPath = path.join(__dirname, '..', 'public', imagePath);
      await fs.unlink(fullPath).catch(err => 
        console.error('Error deleting image:', err)
      );
    }

    await car.remove();
    res.json({ message: 'Car removed' });
  } catch (error) {
    next(error); // Pass to error handler
  }
};

const getCars = async (req, res, next) => {
  try {
    const cars = await Car.find({});
    res.json(cars);
  } catch (error) {
    next(error); // Pass to error handler
  }
};

const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      res.json(car);
    } else {
      const error = new Error('Car not found');
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error); // Pass to error handler
  }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};