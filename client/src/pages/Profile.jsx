import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookingHistory from '../components/bookings/BookingHistory';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-semibold">{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone Number</p>
            <p className="font-semibold">{user.phoneNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Role</p>
            <p className="font-semibold capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Booking History</h2>
        <BookingHistory bookings={bookings} />
      </div>
    </div>
  );
};

export default Profile;