import React from 'react';

const CarCard = ({ car, onSelect }) => {
  return (
    <div 
      onClick={onSelect} 
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
    >
      <img 
        src={car.images && car.images.length > 0 ? car.images[0] : '/api/placeholder/400/300'} 
        alt={`${car.make} ${car.model}`} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{car.make} {car.model}</h3>
        <p className="text-gray-600">{car.year} • {car.transmission}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-blue-600 font-bold">${car.pricePerDay}/day</span>
          <span className={`px-3 py-1 rounded-full text-sm ${car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {car.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CarCard;