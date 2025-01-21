import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const BookingForm = ({ car, onSubmit }) => {
  const { user } = useAuth();
  const [booking, setBooking] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(booking);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Start Date</label>
        <input
          type="date"
          value={booking.startDate}
          onChange={(e) => setBooking({...booking, startDate: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">End Date</label>
        <input
          type="date"
          value={booking.endDate}
          onChange={(e) => setBooking({...booking, endDate: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Pickup Location</label>
        <input
          type="text"
          value={booking.pickupLocation}
          onChange={(e) => setBooking({...booking, pickupLocation: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Dropoff Location</label>
        <input
          type="text"
          value={booking.dropoffLocation}
          onChange={(e) => setBooking({...booking, dropoffLocation: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;