import { Link } from 'react-router-dom';
import { FaCoffee, FaMapMarkedAlt, FaSearch } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center">
            <FaCoffee className="mr-4" /> Discover Your Perfect Cafe
          </h1>
          <p className="text-xl mb-8">Find the best coffee spots near you</p>
          <Link 
            to="/cafes"
            className="bg-white text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition inline-flex items-center"
          >
            <FaSearch className="mr-2" /> Start Exploring
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Why Choose CafeFinder?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <FaSearch className="text-4xl text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Smart Search</h3>
              <p className="text-gray-600 dark:text-gray-300">Find cafes by location, price, and amenities</p>
            </div>
            
            <div className="text-center p-6">
              <FaMapMarkedAlt className="text-4xl text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Interactive Maps</h3>
              <p className="text-gray-600 dark:text-gray-300">See all cafes on an interactive map</p>
            </div>
            
            <div className="text-center p-6">
              <FaCoffee className="text-4xl text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Real Reviews</h3>
              <p className="text-gray-600 dark:text-gray-300">Read and write authentic reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;