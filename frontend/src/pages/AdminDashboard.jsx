import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus, FiEye } from 'react-icons/fi';
import { FaCoffee, FaStar, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const AdminDashboard = () => {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'rating', 'reviews', 'city'

  useEffect(() => {
    fetchCafes();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';
    }
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

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

  // Filter and sort cafes
  useEffect(() => {
    let filtered = [...cafes];

    // Search by name or city
    if (searchTerm) {
      filtered = filtered.filter(cafe =>
        cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.address.street.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by city
    if (cityFilter) {
      filtered = filtered.filter(cafe => cafe.address.city === cityFilter);
    }

    // Filter by price range
    if (priceFilter) {
      filtered = filtered.filter(cafe => cafe.priceRange === priceFilter);
    }

    // Sort cafes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.avgRating - a.avgRating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'city':
          return a.address.city.localeCompare(b.address.city);
        default:
          return 0;
      }
    });

    setFilteredCafes(filtered);
  }, [searchTerm, cityFilter, priceFilter, sortBy, cafes]);

  // Get unique cities for filter
  const cities = [...new Set(cafes.map(cafe => cafe.address.city))].sort();

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cafe?')) return;

    try {
      await axios.delete(`/api/cafes/${id}`);
      const updatedCafes = cafes.filter(cafe => cafe._id !== id);
      setCafes(updatedCafes);
      setFilteredCafes(updatedCafes);
    } catch (error) {
      alert('Failed to delete cafe');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setPriceFilter('');
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">☕</div>
          <div className="text-2xl font-bold text-amber-600 animate-pulse">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              <FaCoffee className="text-purple-600" />
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage {cafes.length} cafes • Showing {filteredCafes.length}
            </p>
          </div>
          <Link
            to="/add-cafe"
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg btn-hover-lift"
          >
            <FiPlus className="text-lg" /> Add New Cafe
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 animate-slideInRight">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
              <FaSearch className="text-white" />
            </div>
            <h3 className="font-bold text-base sm:text-lg dark:text-white">Search & Filter</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-700">
                🔍 Search Cafes
              </label>
              <input
                type="text"
                placeholder="Search by name, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm text-sm sm:text-base"
              />
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-700">
                📍 City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm text-sm sm:text-base"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-700">
                💰 Price
              </label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm text-sm sm:text-base"
              >
                <option value="">All Prices</option>
                <option value="₹">₹ Budget</option>
                <option value="₹₹">₹₹ Moderate</option>
                <option value="₹₹₹">₹₹₹ Premium</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-700">
                🔄 Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm text-sm sm:text-base"
              >
                <option value="name">Name (A-Z)</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="city">City (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filters & Clear Button */}
          {(searchTerm || cityFilter || priceFilter) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active filters:</span>
              {searchTerm && (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  Search: "{searchTerm}"
                </span>
              )}
              {cityFilter && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  City: {cityFilter}
                </span>
              )}
              {priceFilter && (
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                  Price: {priceFilter}
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="ml-auto bg-gray-500 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-600 transition-all"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 mt-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
            <div className="text-2xl sm:text-3xl font-bold">{cafes.length}</div>
            <div className="text-xs sm:text-sm opacity-90">Total Cafes</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg">
            <div className="text-2xl sm:text-3xl font-bold">
              {cafes.reduce((sum, cafe) => sum + cafe.reviewCount, 0)}
            </div>
            <div className="text-xs sm:text-sm opacity-90">Total Reviews</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-xl shadow-lg">
            <div className="text-2xl sm:text-3xl font-bold">
              {cafes.length > 0 ? (cafes.reduce((sum, cafe) => sum + cafe.avgRating, 0) / cafes.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-xs sm:text-sm opacity-90">Avg Rating</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
            <div className="text-2xl sm:text-3xl font-bold">3</div>
            <div className="text-xs sm:text-sm opacity-90">Cities</div>
          </div>
        </div>

      </div>

      {/* Grid View (Mobile and Tablet) */}
      <div className="lg:hidden">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {filteredCafes.map((cafe, index) => (
            <div
              key={cafe._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100 dark:border-gray-700 animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImageUrl(cafe.image)}
                  alt={cafe.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';
                    e.target.onerror = null;
                  }}
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {cafe.priceRange}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
                  {cafe.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <FaMapMarkerAlt className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {cafe.address.city}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <FaStar className="text-yellow-500 dark:text-yellow-400 text-sm" />
                    <span className="font-bold text-sm text-gray-900 dark:text-yellow-100">{cafe.avgRating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {cafe.reviewCount} reviews
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/cafes/${cafe._id}`}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 text-sm font-medium shadow-md"
                  >
                    <FiEye /> View
                  </Link>
                  <Link
                    to={`/edit-cafe/${cafe._id}`}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 text-sm font-medium shadow-md"
                  >
                    <FiEdit2 /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cafe._id)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table View (Large Screens Only) */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCafes.map((cafe) => (
                <tr key={cafe._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={getImageUrl(cafe.image)}
                      alt={cafe.name}
                      className="h-16 w-16 rounded-xl object-cover shadow-md"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';
                        e.target.onerror = null;
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {cafe.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {cafe.reviewCount} reviews
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {cafe.address.city}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-bold">
                      {cafe.priceRange}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-lg w-fit border border-yellow-200 dark:border-yellow-700">
                      <FaStar className="text-yellow-500 dark:text-yellow-400" />
                      <span className="font-bold text-sm text-gray-900 dark:text-yellow-100">{cafe.avgRating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/cafes/${cafe._id}`}
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                        title="View"
                      >
                        <FiEye className="text-lg" />
                      </Link>
                      <Link
                        to={`/edit-cafe/${cafe._id}`}
                        className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                        title="Edit"
                      >
                        <FiEdit2 className="text-lg" />
                      </Link>
                      <button
                        onClick={() => handleDelete(cafe._id)}
                        className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                        title="Delete"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty States */}
      {cafes.length === 0 && (
        <div className="text-center py-20 animate-bounceIn">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No cafes yet
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start by adding your first cafe
          </p>
          <Link
            to="/add-cafe"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-medium shadow-lg btn-hover-lift"
          >
            <FiPlus className="text-lg" /> Add Your First Cafe
          </Link>
        </div>
      )}

      {cafes.length > 0 && filteredCafes.length === 0 && (
        <div className="text-center py-20 animate-bounceIn">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No cafes found
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search or filters
          </p>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-lg btn-hover-lift"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
