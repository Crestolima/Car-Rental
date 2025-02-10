const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
  try {
    const { userId, amount, transactionType } = req.body;
    const transaction = new Transaction({
      userId,
      amount,
      transactionType,
      date: new Date(),
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};