import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const PaymentPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get('amount');
  const days = searchParams.get('days');
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await api.get('/wallet/balance');
        setWalletBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  const handleConfirmPayment = async () => {
    if (walletBalance < amount) {
      alert('Insufficient wallet balance!');
      return;
    }

    try {
      await api.post('/payments/confirm', { carId, amount, days });
      alert('Payment Successful!');
      navigate(`/transactions`);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Try again.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Confirm Payment</h2>
      <p>Total Amount: ${amount}</p>
      <p>Wallet Balance: ${walletBalance}</p>

      <button
        onClick={handleConfirmPayment}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Confirm & Pay
      </button>
    </div>
  );
};

export default PaymentPage;
