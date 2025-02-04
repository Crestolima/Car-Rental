import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Gauge, ChevronLeft, ChevronRight } from 'lucide-react';

const CarCard = ({ car, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorImages, setErrorImages] = useState(new Set());

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index) => {
    setErrorImages((prev) => new Set(prev.add(index)));
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    onSelect();
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-60">
        {(!car.images?.length || errorImages.size === car.images.length) ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
            <span className="text-sm font-medium">Image Unavailable</span>
          </div>
        ) : (
          <div className="relative w-full h-full group">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={`http://localhost:5000${car.images[currentIndex]}`}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
              onError={() => handleImageError(currentIndex)}
            />

            {car.images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </motion.button>

                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {car.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentIndex === index ? 'bg-white' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="absolute top-4 right-4">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            car.available 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {car.available ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900"
          >
            {car.make} {car.model}
          </motion.h3>
          <p className="text-gray-600 mt-1">{car.year} • {car.type}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Gauge className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mileage</p>
              <p className="text-sm font-medium text-gray-900">
                {car.mileage || 'Unavailable'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Transmission</p>
              <p className="text-sm font-medium text-gray-900">{car.transmission}</p>
            </div>
          </div>

          {car.fuelType && (
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl col-span-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fuel Type</p>
                <p className="text-sm font-medium text-gray-900">{car.fuelType}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Daily Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              ${car.pricePerDay}<span className="text-lg font-medium">/day</span>
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            disabled={!car.available}
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;