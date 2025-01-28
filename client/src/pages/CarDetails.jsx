import React, { useState, useEffect } from "react";

const CarDetails = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [carType, setCarType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars");
        const data = await response.json();
        setCars(data);
        setFilteredCars(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setCarType(value);
    if (value === "all") {
      setFilteredCars(cars);
    } else {
      setFilteredCars(cars.filter((car) => car.type === value));
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    let sortedCars = [...filteredCars];

    switch (value) {
      case "price-asc":
        sortedCars.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "price-desc":
        sortedCars.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "year-asc":
        sortedCars.sort((a, b) => a.year - b.year);
        break;
      case "year-desc":
        sortedCars.sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }

    setFilteredCars(sortedCars);
  };

  const handleOpen = (car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Available Cars
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <select
            value={carType}
            onChange={handleTypeChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Truck">Truck</option>
          </select>

          <select
            value={sortOption}
            onChange={handleSortChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white shadow-sm"
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-asc">Year: Old to New</option>
            <option value="year-desc">Year: New to Old</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div 
                key={car._id} 
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden group">
                  <img
                    src={car.images?.[0] || "/api/placeholder/400/300"}
                    alt={`${car.make} ${car.model}`}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-lg font-bold text-blue-600">
                      ${car.pricePerDay}
                      <span className="text-sm text-gray-500 font-normal">/day</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mb-6 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 rounded-full">{car.year}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">{car.type}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">{car.transmission}</span>
                  </div>
                  <button
                    onClick={() => handleOpen(car)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedCar && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowModal(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 overflow-hidden">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedCar.make} {selectedCar.model}
              </h2>
              
              <div className="space-y-6">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={selectedCar.images?.[0] || "/api/placeholder/400/300"}
                    alt={`${selectedCar.make} ${selectedCar.model}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="text-lg font-medium text-gray-900">{selectedCar.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="text-lg font-medium text-gray-900">{selectedCar.type}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="text-lg font-medium text-gray-900">{selectedCar.transmission}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-lg font-medium text-gray-900">
                        {selectedCar.location?.city}, {selectedCar.location?.address}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-bold text-blue-600">
                      ${selectedCar.pricePerDay}
                      <span className="text-base font-normal text-gray-500">/day</span>
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;