import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, onLocationSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, location);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Cafes</label>
          <input
            type="text"
            placeholder="Cafe name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            placeholder="City..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 px-6 rounded-lg hover:bg-amber-700 transition flex items-center justify-center"
          >
            <FaSearch className="mr-2" /> Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;