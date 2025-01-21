import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarCard from '../components/cars/CarCard';
import api from '../services/api';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    make: '',
    type: '',
    transmission: '',
    minPrice: '',
    maxPrice: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCars();
  }, [filters]);

  const loadCars = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/cars?${params.toString()}`);
      setCars(response.data);
    } catch (error) {
      console.error('Error loading cars:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Available Cars</h1>
        {/* Add filter controls here */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(car => (
          <CarCard
            key={car._id}
            car={car}
            onSelect={() => navigate(`/cars/${car._id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;