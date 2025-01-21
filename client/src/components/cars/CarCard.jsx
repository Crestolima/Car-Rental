const CarCard = ({ car, onSelect }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={car.images[0] || '/api/placeholder/400/200'}
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold">
            {car.make} {car.model} ({car.year})
          </h3>
          <div className="mt-2 text-gray-600">
            <p>Type: {car.type}</p>
            <p>Transmission: {car.transmission}</p>
            <p className="text-lg font-bold text-blue-600">
              ${car.pricePerDay}/day
            </p>
          </div>
          <button
            onClick={() => onSelect(car)}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };
  
  export default CarCard;