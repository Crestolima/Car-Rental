import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookingForm from '../components/bookings/BookingPage';
import Error from '../components/common/Error';
import Loading from '../components/common/Loading';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { calculateTotalPrice, validateDates } from '../utils/helpers';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCarDetails();
  }, [id]);

  const loadCarDetails = async () => {
    try {
      const response = await api.get(`/cars/${id}`);
      setCar(response.data);
    } catch (error) {
      setError('Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (bookingData) => {
    try {
      const validationError = validateDates(bookingData.startDate, bookingData.endDate);
      if (validationError) {
        setError(validationError);
        return;
      }

      const totalPrice = calculateTotalPrice(
        bookingData.startDate,
        bookingData.endDate,
        car.pricePerDay
      );

      const response = await api.post('/bookings', {
        carId: id,
        ...bookingData,
        totalPrice
      });

      navigate(`/profile`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!car) return <Error message="Car not found" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Your Car</h1>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <img
              src={car.images[0] || '/api/placeholder/200/120'}
              alt={`${car.make} ${car.model}`}
              className="w-32 h-20 object-cover rounded"
            />
            <div className="ml-4">
              <h2 className="text-xl font-bold">
                {car.make} {car.model} ({car.year})
              </h2>
              <p className="text-gray-600">{car.type} • {car.transmission}</p>
              <p className="text-blue-600 font-bold">${car.pricePerDay}/day</p>
            </div>
          </div>
          
          <BookingForm car={car} onSubmit={handleBooking} />
        </div>
      </div>
    </div>
  );
};

export default Booking;