// controllers/bookingController.js
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { carId, startDate, endDate, pickupLocation, dropoffLocation } = req.body;
    
    // Step 1: Find Car
    const car = await Car.findById(carId);
    if (!car) {
      throw new Error('Car not found');
    }

    // Step 2: Calculate Total Price
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    // Step 3: Find User's Wallet
    const userWallet = await Wallet.findOne({ userId: req.user._id }).session(session);
    if (!userWallet || userWallet.balance < totalPrice) {
      throw new Error('Insufficient wallet balance');
    }

    // Step 4: Deduct Money from User's Wallet
    userWallet.balance -= totalPrice;
    await userWallet.save({ session });

    // Step 5: Create Booking
    const booking = await Booking.create([{
      carId,
      userId: req.user._id,
      startDate,
      endDate,
      totalPrice,
      pickupLocation,
      dropoffLocation,
      status: 'confirmed',
      paymentStatus: 'paid',
    }], { session });

    // Step 6: Create Payment
    const payment = await Payment.create([{
      booking: booking[0]._id,
      amount: totalPrice,
      status: 'paid',
    }], { session });

    // Step 7: Create Transaction
    await Transaction.create([{
      userId: req.user._id,
      walletId: userWallet._id,
      amount: totalPrice,
      transactionType: 'debit',
      status: 'completed',
      description: 'Car booking payment',
    }], { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return the created booking
    res.status(201).json({ message: 'Booking created successfully', booking: booking[0], payment });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('carId')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      booking.status = req.body.status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus };
