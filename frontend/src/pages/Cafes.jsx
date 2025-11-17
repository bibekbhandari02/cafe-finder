import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CafeCard from '../components/CafeCard';
import MapView from '../components/MapView';

const Cafes = () => {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    fetchCafes();
  }, []);

  const fetchCafes = async () => {
    try {
      const { data } = await axios.get('/api/cafes');
      setCafes(data);
      setFilteredCafes(data);
    } catch (error) {
      console.error('Error fetching cafes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm, location) => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (location) params.append('city', location);
      if (priceFilter) params.append('priceRange', priceFilter);
      
      const { data } = await axios.get(`/api/cafes?${params}`);
      setFilteredCafes(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-amber-600">Loading cafes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Discover Cafes</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 dark:text-white">Price Range</label>
        <select 
          value={priceFilter}
          onChange={(e) => {
            setPriceFilter(e.target.value);
            handleSearch('', '');
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
        >
          <option value="">All Prices</option>
          <option value="₹">₹ (Budget)</option>
          <option value="₹₹">₹₹ (Moderate)</option>
          <option value="₹₹₹">₹₹₹ (Expensive)</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCafes.map(cafe => (
              <div 
                key={cafe._id} 
                onClick={() => setSelectedCafe(cafe)}
                className="cursor-pointer"
              >
                <CafeCard cafe={cafe} />
              </div>
            ))}
          </div>
          
          {filteredCafes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">No cafes found. Try adjusting your search.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Map View</h2>
            <MapView cafes={filteredCafes} selectedCafe={selectedCafe} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cafes;