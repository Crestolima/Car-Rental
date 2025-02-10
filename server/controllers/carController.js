const Car = require('../models/Car');
const fs = require('fs').promises;
const path = require('path');

const createCar = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next({ message: 'No images provided', statusCode: 400 });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

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
        coordinates: { latitude: 0, longitude: 0 },
      },
    };

    // Parse JSON fields safely
    try {
      if (req.body.features) carData.features = JSON.parse(req.body.features);
      if (req.body.location) carData.location = JSON.parse(req.body.location);
    } catch (error) {
      return next({ message: 'Invalid JSON format', statusCode: 400 });
    }

    const car = await Car.create(carData);
    res.status(201).json(car);
  } catch (error) {
    if (req.files) {
      await Promise.all(req.files.map(file => fs.unlink(file.path).catch(console.error)));
    }
    next(error);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return next({ message: 'Car not found', statusCode: 404 });

    if (req.files && req.files.length > 0) {
      // Delete old images
      await Promise.all(
        car.images.map(imagePath =>
          fs.unlink(path.join(__dirname, '..', imagePath)).catch(console.error)
        )
      );
      req.body.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Parse JSON fields safely
    try {
      if (req.body.features) req.body.features = JSON.parse(req.body.features);
      if (req.body.location) req.body.location = JSON.parse(req.body.location);
    } catch (error) {
      return next({ message: 'Invalid JSON format', statusCode: 400 });
    }

    Object.assign(car, req.body);
    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (error) {
    if (req.files) {
      await Promise.all(req.files.map(file => fs.unlink(file.path).catch(console.error)));
    }
    next(error);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return next({ message: 'Car not found', statusCode: 404 });

    await Promise.all(
      car.images.map(imagePath =>
        fs.unlink(path.join(__dirname, '..', imagePath)).catch(console.error)
      )
    );

    await car.deleteOne();
    res.json({ message: 'Car removed' });
  } catch (error) {
    next(error);
  }
};

const getCars = async (req, res, next) => {
  try {
    const cars = await Car.find({}).lean();
    res.json(cars);
  } catch (error) {
    next(error);
  }
};

const getCarById = async (req, res, next) => {
  try {
    const { carId } = req.params; // Fix: Use carId instead of id

    console.log("Fetching car with ID:", carId); // Debugging

    const car = await Car.findById(carId).lean();

    if (!car) return next({ message: "Car not found", statusCode: 404 });

    res.json(car);
  } catch (error) {
    console.error("Error fetching car details:", error);
    next(error);
  }
};


module.exports = { getCars, getCarById, createCar, updateCar, deleteCar };
