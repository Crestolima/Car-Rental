import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, CreditCard, Calendar, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Wallet = () => {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, walletBalance, fetchWalletBalance } = useAuth();

  useEffect(() => {
    if (user?._id) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      if (!user?._id) return;
      
      const response = await api.get(`/wallet/${user._id}`);
      if (response.data) {
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      setError('Error fetching wallet details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/wallet/add-funds', {
        userId: user._id,
        amount: parseFloat(amount),
        cardNumber,
        expiryDate,
        cvv,
      });

      // Refresh wallet balance and transactions
      await fetchWalletBalance(user._id);
      await fetchTransactions();

      // Reset form
      setAmount('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
    } catch (error) {
      setError('Failed to add funds. Please try again.');
      console.error('Error adding funds:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <WalletIcon className="h-6 w-6" />
            Wallet Balance
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Balance Section */}
            <div className="space-y-4">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg text-gray-600">Current Balance</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  ${walletBalance.toFixed(2)}
                </p>
              </div>

              {transactions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((transaction, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{transaction.type}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add Funds Form */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Add Funds</h3>
              <form onSubmit={handleAddFunds} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter amount"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                      USD
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter card number"
                    />
                    <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="MM/YY"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <div className="mt-1 relative">
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                        maxLength="4"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter CVV"
                      />
                      <KeyRound className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Funds
                </button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;