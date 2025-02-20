import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  Calendar, 
  KeyRound, 
  ArrowUpCircle, 
  ArrowDownCircle,
  TrendingUp,
  
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 px-6 text-sm font-medium rounded-xl transition-all duration-200 transform
      ${active 
        ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg scale-102' 
        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-102'}`}
  >
    {children}
  </button>
);



const Wallet = () => {
  // ... [Previous state and hooks remain the same]
  const [activeTab, setActiveTab] = useState('add-funds');
  const [formData, setFormData] = useState({
    amount: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localWalletBalance, setLocalWalletBalance] = useState(0);
  const { user, fetchWalletBalance } = useAuth();

  // ... [Previous fetchWalletData, useEffect, and handlers remain the same]
  const fetchWalletData = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const response = await api.get(`/wallet/${user._id}`);
      if (response.data) {
        setTransactions(response.data.transactions || []);
        setLocalWalletBalance(response.data.balance);
        fetchWalletBalance(user._id);
      }
    } catch (err) {
      setError('Error fetching wallet details');
    } finally {
      setLoading(false);
    }
  }, [user?._id, fetchWalletBalance]);

  useEffect(() => {
    if (!user?._id) return;
    fetchWalletData();
    const pollInterval = setInterval(fetchWalletData, 30000);
    return () => clearInterval(pollInterval);
  }, [user?._id, fetchWalletData]);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post('/wallet/add-funds', {
        userId: user._id,
        amount: parseFloat(formData.amount),
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      });
      if (response.data) {
        setLocalWalletBalance(response.data.balance);
        await fetchWalletData();
        setFormData({ amount: '', cardNumber: '', expiryDate: '', cvv: '' });
      }
    } catch (err) {
      setError('Failed to add funds. Please try again.');
    }
  };

  const TransactionCard = ({ transaction }) => (
    <div className="group flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className={`p-3 rounded-xl transition-colors ${
        transaction.type === 'credit' 
          ? 'bg-green-50 group-hover:bg-green-100' 
          : 'bg-red-50 group-hover:bg-red-100'
      }`}>
        {transaction.type === 'credit' ? (
          <ArrowUpCircle className="h-6 w-6 text-green-500" />
        ) : (
          <ArrowDownCircle className="h-6 w-6 text-red-500" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{transaction.type === 'credit' ? 'Deposit' : 'Withdrawal'}</p>
        <p className="text-sm text-gray-500">
          {new Date(transaction.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
      <p className={`font-semibold text-lg ${
        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
      }`}>
        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
      </p>
    </div>
  );

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <WalletIcon className="h-8 w-8" />
                Digital Wallet
              </h2>
              <p className="mt-2 opacity-90">Manage your funds and transactions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl">
              <p className="text-sm opacity-90">Available Balance</p>
              <p className="text-4xl font-bold mt-1">${localWalletBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          

          <div className="flex space-x-3 mb-8">
            <TabButton 
              active={activeTab === 'add-funds'} 
              onClick={() => setActiveTab('add-funds')}
            >
              Add Funds
            </TabButton>
            <TabButton 
              active={activeTab === 'transactions'} 
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </TabButton>
          </div>

          {activeTab === 'add-funds' && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <form onSubmit={handleAddFunds} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                      />
                      <span className="absolute right-4 top-3 text-gray-500">USD</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                      />
                      <CreditCard className="absolute right-4 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <input
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                        <Calendar className="absolute right-4 top-3 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <div className="relative">
                        <input
                          name="cvv"
                          type="password"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength="4"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                        <KeyRound className="absolute right-4 top-3 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Funds
                </button>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <TransactionCard key={transaction._id || index} transaction={transaction} />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                  <p className="text-lg">No transactions yet</p>
                  <p className="text-sm mt-1">Your transaction history will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;