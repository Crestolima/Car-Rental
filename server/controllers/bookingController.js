const Booking = require('../models/Booking');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Car = require('../models/Car');
const User = require('../models/User');
const mongoose = require('mongoose');

const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId, carId, startDate, endDate, pickupLocation, dropoffLocation } = req.body;

    const car = await Car.findById(carId).session(session);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    const booking = new Booking({
      user: userId,
      car: carId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      totalPrice,
      status: 'pending'
    });

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Booking created', booking });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const processPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { bookingId } = req.params;
    const { userId } = req.body;

    const booking = await Booking.findById(bookingId).populate('car').session(session);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const userWallet = await Wallet.findOne({ userId }).session(session);
    if (!userWallet || userWallet.balance < booking.totalPrice) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const admin = await User.findOne({ role: 'admin' }).session(session);
    if (!admin) return res.status(500).json({ message: 'Admin account not found' });

    let adminWallet = await Wallet.findOne({ userId: admin._id }).session(session);
    if (!adminWallet) {
      adminWallet = new Wallet({ userId: admin._id, balance: 0, transactions: [] });
      await adminWallet.save({ session });
    }

    // Deduct from user wallet
    userWallet.balance -= booking.totalPrice;
    userWallet.transactions.push({
      type: 'debit',
      amount: booking.totalPrice,
      description: `Payment for booking (ID: ${booking._id})`
    });

    // Credit to admin wallet
    adminWallet.balance += booking.totalPrice;
    adminWallet.transactions.push({
      type: 'credit',
      amount: booking.totalPrice,
      description: `Received payment for booking (ID: ${booking._id})`
    });

    await userWallet.save({ session });
    await adminWallet.save({ session });

    // Create transaction record
    const transaction = new Transaction({
      userId,
      walletId: userWallet._id,
      amount: booking.totalPrice,
      transactionType: 'debit',
      status: 'completed',
      description: `Payment for booking (ID: ${booking._id})`
    });

    await transaction.save({ session });

    booking.status = 'confirmed';
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Payment successful', booking, balance: userWallet.balance });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId }).populate('car');
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createBooking, processPayment, getBookings };
