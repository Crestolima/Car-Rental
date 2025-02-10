import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gauge
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

import 'react-toastify/dist/ReactToastify.css';
import BookingPage from './BookingPage';

const ShowAllCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars');
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900">Available Cars</h2>
        <p className="text-gray-600">Browse our selection of premium vehicles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car._id} className="relative">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img
                  src={`http://localhost:5000${car.images[0]}`}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{car.make} {car.model}</h3>
                <p className="text-sm text-gray-500">{car.year} • {car.type}</p>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {car.available ? 'Available' : 'Not Available'}
                </span>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Gauge className="w-4 h-4 mr-2" />
                    <span>{car.mileage || 'Mileage info unavailable'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{car.transmission}</span>
                  </div>
                  {car.fuelType && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{car.fuelType}</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">Daily Rate</span>
                    <p className="text-lg font-semibold text-indigo-600">${car.pricePerDay}/day</p>
                  </div>
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!car.available}
                    onClick={() => {
                      setSelectedCarId(car._id);
                      setIsBookingModalOpen(true);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
            </div>
        ))}
      </div>

      <BookingPage
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedCarId(null);
        }}
        carId={selectedCarId}
      />
    </div>
  );
};

export default ShowAllCars;