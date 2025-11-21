import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CafeCard from '../components/CafeCard';
import CafeCardSkeleton from '../components/CafeCardSkeleton';
import MapView from '../components/MapView';
import { FaFilter } from 'react-icons/fa';
import { isOpenNow } from '../utils/cafeUtils';

const Cafes = () => {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [priceFilter, setPriceFilter] = useState('');
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('rating'); // rating, name, price
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchCafes();
  }, []);

  useEffect(() => {
    // Re-fetch when price filter changes
    handleSearch(searchTerm, location);
  }, [priceFilter]);

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

  const handleSearch = async (search = '', loc = '') => {
    try {
      setSearchTerm(search);
      setLocation(loc);
      
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (loc) params.append('city', loc);
      if (priceFilter) params.append('priceRange', priceFilter);
      
      const { data } = await axios.get(`/api/cafes?${params}`);
      setFilteredCafes(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Filter by Open Now
  const openFilteredCafes = openNowFilter 
    ? filteredCafes.filter(cafe => isOpenNow(cafe.openingHours))
    : filteredCafes;

  // Sort cafes
  const sortedCafes = [...openFilteredCafes].sort((a, b) => {
    if (sortBy === 'rating') return b.avgRating - a.avgRating;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') {
      const priceOrder = { '₹': 1, '₹₹': 2, '₹₹₹': 3 };
      return (priceOrder[a.priceRange] || 0) - (priceOrder[b.priceRange] || 0);
    }
    return 0;
  });

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Discover Cafes</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-amber-600" />
          <h3 className="font-semibold dark:text-white">Filters & Sort</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Price Range</label>
            <select 
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Prices</option>
              <option value="₹">₹ (Budget)</option>
              <option value="₹₹">₹₹ (Moderate)</option>
              <option value="₹₹₹">₹₹₹ (Expensive)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Sort By</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white"
            >
              <option value="rating">Highest Rated</option>
              <option value="name">Name (A-Z)</option>
              <option value="price">Price (Low to High)</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={openNowFilter}
                onChange={(e) => setOpenNowFilter(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <span className="text-sm font-medium dark:text-white">Open Now Only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <CafeCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {sortedCafes.map(cafe => (
                  <div 
                    key={cafe._id} 
                    onClick={() => setSelectedCafe(cafe)}
                    className="cursor-pointer"
                  >
                    <CafeCard cafe={cafe} />
                  </div>
                ))}
              </div>
              
              {sortedCafes.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 dark:text-gray-300">No cafes found. Try adjusting your filters.</p>
                </div>
              )}
            </>
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