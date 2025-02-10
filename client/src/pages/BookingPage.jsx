import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const BookingPage = ({ isOpen, onClose, carId }) => {
  const modalRef = useRef();
  const navigate = useNavigate();
  const { user, walletBalance, fetchWalletBalance } = useAuth();
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!carId || !isOpen) return;
  
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/cars/${carId}`);
        setCar(data);
      } catch (error) {
        console.error('Error fetching car details:', error);
        toast.error('Error loading car details');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCarDetails();
  }, [carId, isOpen]);

  useEffect(() => {
    if (car && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max((end - start) / (1000 * 60 * 60 * 24), 1);
      setTotalPrice(days * car.pricePerDay);
    }
  }, [car, startDate, endDate]);

  const handleBooking = async () => {
    if (!startDate || !endDate || !pickupLocation || !dropoffLocation) {
      toast.warning('Please fill all required fields.');
      return;
    }
    
    if (walletBalance < totalPrice) {
      toast.error('Insufficient wallet balance. Please recharge.');
      return;
    }

    try {
      await api.post('/booking', {
        user: user._id,
        car: carId,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        totalPrice,
        status: 'pending'
      });

      await api.post('/transactions', {
        userId: user._id,
        walletId: user._id,
        amount: totalPrice,
        transactionType: 'debit',
        description: `Booking payment for ${car.make} ${car.model}`,
      });

      if (user && user._id) {
        await fetchWalletBalance(user._id);
      }
      
      toast.success('Booking successful!');
      onClose();
      navigate('/payments');
    } catch (error) {
      console.error('Error processing booking:', error);
      toast.error('Error processing booking. Please try again.');
    }
  };

  const validateDates = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return startDate >= today && endDate >= startDate;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Book Your Car</h2>
          {car && (
            <p className="text-sm text-gray-600 mt-1">
              {car.make} {car.model} - {car.year}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="date"
                      className="pl-10 w-full border border-gray-300 rounded-lg h-10 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (endDate && !validateDates(e.target.value, endDate)) {
                          toast.warning('Invalid date selection');
                        }
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="date"
                      className="pl-10 w-full border border-gray-300 rounded-lg h-10 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (startDate && !validateDates(startDate, e.target.value)) {
                          toast.warning('Invalid date selection');
                        }
                      }}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      className="pl-10 w-full border border-gray-300 rounded-lg h-10 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Enter pickup location"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dropoff Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      className="pl-10 w-full border border-gray-300 rounded-lg h-10 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Enter dropoff location"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Price Information */}
              <div className="flex justify-between items-center py-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="text-lg font-semibold text-indigo-600">
                    ${totalPrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wallet Balance</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${walletBalance}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className={`w-full py-2 px-4 rounded-lg text-white font-medium 
                  ${
                    !startDate || !endDate || !pickupLocation || !dropoffLocation || !validateDates(startDate, endDate)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                onClick={handleBooking}
                disabled={!startDate || !endDate || !pickupLocation || !dropoffLocation || !validateDates(startDate, endDate)}
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage; 
