const Review = require('../models/Review');

const createReview = async (req, res) => {
  try {
    const { carId, bookingId, rating, comment } = req.body;
    
    const existingReview = await Review.findOne({
      userId: req.user._id,
      bookingId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }

    const review = await Review.create({
      userId: req.user._id,
      carId,
      bookingId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ carId: req.params.carId })
      .populate('userId', 'firstName lastName')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getCarReviews };