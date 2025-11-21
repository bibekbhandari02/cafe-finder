import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  // Real-time search as user types (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm, location);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, location);
  };

  const handleClear = () => {
    setSearchTerm('');
    setLocation('');
    onSearch('', '');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="relative group">
          <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-700">
            🔍 Search Cafes
          </label>
          <input
            type="text"
            placeholder="Type cafe name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-all shadow-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-11 text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="relative group">
          <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-700">
            📍 Location
          </label>
          <input
            type="text"
            placeholder="Type city name..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm"
          />
          {location && (
            <button
              type="button"
              onClick={() => setLocation('')}
              className="absolute right-3 top-11 text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="flex items-end gap-2 sm:col-span-2 md:col-span-1">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center font-medium shadow-lg btn-hover-lift text-sm sm:text-base"
          >
            <FaSearch className="mr-2 text-sm sm:text-base" /> 
            <span className="hidden sm:inline">Search</span>
            <span className="sm:hidden">Go</span>
          </button>
          {(searchTerm || location) && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg btn-hover-lift"
              title="Clear all"
            >
              <FaTimes className="text-sm sm:text-base" />
            </button>
          )}
        </div>
      </div>
      
      {(searchTerm || location) && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 animate-slideInLeft">
          <span className="font-medium">Searching for:</span>
          {searchTerm && (
            <span className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 text-amber-800 dark:text-amber-200 px-3 py-1.5 rounded-full font-medium border border-amber-200 dark:border-amber-800">
              "{searchTerm}"
            </span>
          )}
          {location && (
            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full font-medium border border-blue-200 dark:border-blue-800">
              📍 {location}
            </span>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;