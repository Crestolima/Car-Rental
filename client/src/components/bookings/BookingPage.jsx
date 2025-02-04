import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await api.get(`/cars/${carId}`);
        setCar(response.data);
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const handleProceedToPayment = () => {
    const totalAmount = car.pricePerDay * days;
    navigate(`/payment/${carId}?days=${days}&amount=${totalAmount}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">{car.make} {car.model} - Booking</h2>
      <p>Price per day: ${car.pricePerDay}</p>

      <label className="block mt-4">
        <span className="text-gray-700">Number of Days</span>
        <input
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="border p-2 w-20 rounded"
        />
      </label>

      <p className="mt-2">Total Cost: ${car.pricePerDay * days}</p>

      <button
        onClick={handleProceedToPayment}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default BookingPage;
