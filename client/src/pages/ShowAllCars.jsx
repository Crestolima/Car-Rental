import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Gauge, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const ShowAllCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleBookNow = (carId) => {
    navigate(`/booking/${carId}`);
  };

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
          <div key={car._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <ImageCarousel images={car.images} alt={`${car.make} ${car.model}`} />
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {car.make} {car.model}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500">{car.year} • {car.type}</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {car.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Gauge className="w-4 h-4 mr-2" />
                  <span>{car.mileage || 'Mileage information unavailable'}</span>
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

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">Daily Rate</span>
                    <p className="text-lg font-semibold text-indigo-600">
                      ${car.pricePerDay}/day
                    </p>
                  </div>
                  <button
                    onClick={() => handleBookNow(car._id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    disabled={!car.available}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageCarousel = ({ images = [], alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorImages, setErrorImages] = useState(new Set());

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index) => {
    setErrorImages((prev) => new Set(prev.add(index)));
  };

  // If there are no images or all images have errors, show placeholder
  if (!images.length || errorImages.size === images.length) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600">
        Image Unavailable
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <img
        src={`http://localhost:5000${images[currentIndex]}`}
        alt={`${alt} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover"
        onError={() => handleImageError(currentIndex)}
      />

      {images.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
          
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShowAllCars;