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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium mb-2 dark:text-white">Search Cafes</label>
          <input
            type="text"
            placeholder="Type cafe name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium mb-2 dark:text-white">Location</label>
          <input
            type="text"
            placeholder="Type city name..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {location && (
            <button
              type="button"
              onClick={() => setLocation('')}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 bg-amber-600 text-white py-2 px-6 rounded-lg hover:bg-amber-700 transition flex items-center justify-center"
          >
            <FaSearch className="mr-2" /> Search
          </button>
          {(searchTerm || location) && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              title="Clear all"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
      
      {(searchTerm || location) && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Searching for: 
          {searchTerm && <span className="ml-2 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded">"{searchTerm}"</span>}
          {location && <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">in {location}</span>}
        </div>
      )}
    </form>
  );
};

export default SearchBar;