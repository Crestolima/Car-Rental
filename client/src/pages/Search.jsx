import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CarList from '../components/cars/CarList';
import Loading from '../components/common/Loading';
import api from '../services/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });

  useEffect(() => {
    searchCars();
  }, [searchParams]);

  const searchCars = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cars', { params: filters });
      setCars(response.data);
    } catch (error) {
      console.error('Error searching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setSearchParams(filters);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <form onSubmit={applyFilters} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="make"
            placeholder="Make"
            value={filters.make}
            onChange={handleFilterChange}
            className="rounded border-gray-300"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="rounded border-gray-300"
          >
            <option value="">All Types</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="sports">Sports</option>
          </select>
          <div className="flex space-x-4">
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="rounded border-gray-300 w-1/2"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="rounded border-gray-300 w-1/2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>
      <CarList cars={cars} />
    </div>
  );
};

export default Search;
