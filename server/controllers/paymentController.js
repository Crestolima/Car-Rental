const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');

const processPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookingId, amount } = req.body;
    const userId = req.user._id;

    // Step 1: Find the user's wallet
    const userWallet = await Wallet.findOne({ userId }).session(session);
    if (!userWallet || userWallet.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Step 2: Deduct from user's wallet
    userWallet.balance -= amount;
    await userWallet.save({ session });

    // Step 3: Store the payment
    const payment = await Payment.create([{ booking: bookingId, amount, status: 'paid' }], { session });

    // Step 4: Create a transaction for the user
    await Transaction.create([{
      userId,
      walletId: userWallet._id,
      amount,
      transactionType: 'debit',
      status: 'completed',
      description: 'Car booking payment'
    }], { session });

    // Step 5: Credit the amount to the admin's wallet
    const admin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 }); // Get the first admin
    if (!admin) throw new Error('Admin not found');

    let adminWallet = await Wallet.findOne({ userId: admin._id }).session(session);
    if (!adminWallet) {
      adminWallet = new Wallet({ userId: admin._id, balance: 0, transactions: [] });
    }

    adminWallet.balance += amount;
    adminWallet.transactions.push({
      type: 'credit',
      amount,
      description: 'Booking payment received from user'
    });

    await adminWallet.save({ session });

    // Step 6: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Payment successful', payment: payment[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

module.exports = { processPayment };
