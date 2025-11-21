import { useState, useEffect } from 'react';
import axios from '../config/api';
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
      console.log('Fetched cafes:', data); // Debug log
      // Ensure data is an array
      const cafesArray = Array.isArray(data) ? data : [];
      setCafes(cafesArray);
      setFilteredCafes(cafesArray);
    } catch (error) {
      console.error('Error fetching cafes:', error);
      console.error('Error details:', error.response?.data);
      setCafes([]);
      setFilteredCafes([]);
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
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8 animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Discover Cafes
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Explore {sortedCafes.length} amazing coffee spots
        </p>
      </div>
      
      <div className="animate-slideInLeft">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 animate-slideInRight">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
            <FaFilter className="text-white text-sm sm:text-base" />
          </div>
          <h3 className="font-bold text-base sm:text-lg dark:text-white">Filters & Sort</h3>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="animate-scaleIn">
            <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-700">
              💰 Price Range
            </label>
            <select 
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:border-amber-500 dark:focus:border-amber-500 transition-all"
            >
              <option value="">All Prices</option>
              <option value="₹">₹ (Budget)</option>
              <option value="₹₹">₹₹ (Moderate)</option>
              <option value="₹₹₹">₹₹₹ (Expensive)</option>
            </select>
          </div>

          <div className="animate-scaleIn" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-700">
              🔄 Sort By
            </label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:border-amber-500 dark:focus:border-amber-500 transition-all"
            >
              <option value="rating">⭐ Highest Rated</option>
              <option value="name">🔤 Name (A-Z)</option>
              <option value="price">💵 Price (Low to High)</option>
            </select>
          </div>

          <div className="flex items-end animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <label className="flex items-center gap-3 cursor-pointer bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 py-3 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all w-full">
              <input
                type="checkbox"
                checked={openNowFilter}
                onChange={(e) => setOpenNowFilter(e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
              />
              <span className="text-sm font-semibold dark:text-white text-gray-700">
                🟢 Open Now Only
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map(i => (
                <CafeCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {sortedCafes.map((cafe, index) => (
                  <div 
                    key={cafe._id} 
                    onClick={() => setSelectedCafe(cafe)}
                    className="cursor-pointer animate-fadeIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CafeCard cafe={cafe} />
                  </div>
                ))}
              </div>
              
              {sortedCafes.length === 0 && (
                <div className="text-center py-20 animate-bounceIn">
                  <div className="text-6xl mb-4">😔</div>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                    No cafes found
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-24 animate-slideInRight">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🗺️</span>
                Map View
              </h2>
              <MapView cafes={filteredCafes} selectedCafe={selectedCafe} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cafes;