import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../components/bookings/BookingForm';
import api from '../services/api';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadCarDetails();
    loadCarReviews();
  }, [id]);

  const loadCarDetails = async () => {
    try {
      const response = await api.get(`/cars/${id}`);
      setCar(response.data);
    } catch (error) {
      console.error('Error loading car details:', error);
    }
  };

  const loadCarReviews = async () => {
    try {
      const response = await api.get(`/reviews/car/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleBooking = async (bookingData) => {
    try {
      await api.post('/bookings', {
        carId: id,
        ...bookingData
      });
      // Handle success (e.g., show notification, redirect)
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (!car) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={car.images[0] || '/api/placeholder/600/400'}
            alt={`${car.make} ${car.model}`}
            className="w-full rounded-lg"
          />
          <div className="mt-4">
            <h1 className="text-3xl font-bold">
              {car.make} {car.model} ({car.year})
            </h1>
            <p className="text-xl text-blue-600 font-bold mt-2">
              ${car.pricePerDay}/day
            </p>
            <div className="mt-4 space-y-2">
              <p>Type: {car.type}</p>
              <p>Transmission: {car.transmission}</p>
              <p>Location: {car.location.city}</p>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Features</h2>
              <ul className="list-disc pl-5">
                {car.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <BookingForm car={car} onSubmit={handleBooking} />
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            {reviews.map(review => (
              <div key={review._id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <span className="font-bold">
                    {review.userId.firstName} {review.userId.lastName}
                  </span>
                  <span className="ml-2 text-yellow-500">
                    {'★'.repeat(review.rating)}
                  </span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
