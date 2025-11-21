import { Link } from 'react-router-dom';
import { FaCoffee, FaMapMarkedAlt, FaSearch } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white py-16 sm:py-24 md:py-32 relative overflow-hidden animate-gradient">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl animate-float">☕</div>
          <div className="absolute bottom-10 right-10 text-9xl animate-float" style={{ animationDelay: '1s' }}>☕</div>
          <div className="absolute top-1/2 left-1/4 text-6xl animate-float" style={{ animationDelay: '0.5s' }}>☕</div>
          <div className="absolute top-1/4 right-1/4 text-7xl animate-float" style={{ animationDelay: '1.5s' }}>☕</div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="animate-fadeIn">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <FaCoffee className="animate-bounce text-4xl sm:text-5xl md:text-6xl" /> 
              <span className="bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                Discover Your Perfect Cafe
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 font-light animate-slideInLeft px-4" style={{ animationDelay: '0.2s' }}>
              Find the best coffee spots near you
            </p>
            <p className="text-base sm:text-lg mb-8 sm:mb-10 opacity-90 animate-slideInRight" style={{ animationDelay: '0.3s' }}>
              15+ cafes across Kathmandu Valley
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 animate-bounceIn" style={{ animationDelay: '0.4s' }}>
              <Link 
                to="/cafes"
                className="bg-white text-amber-600 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 transition-all shadow-2xl inline-flex items-center justify-center gap-2 btn-hover-lift text-sm sm:text-base"
              >
                <FaSearch className="text-base sm:text-lg" /> Browse Cafes
              </Link>
              <Link 
                to="/map"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all shadow-2xl inline-flex items-center justify-center gap-2 btn-hover-lift text-sm sm:text-base"
              >
                <FaMapMarkedAlt className="text-base sm:text-lg" /> Map Search
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 dark:text-white animate-fadeIn">
            Why Choose CafeFinder?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 md:mb-16 text-base sm:text-lg animate-fadeIn px-4" style={{ animationDelay: '0.1s' }}>
            Everything you need to find your next favorite cafe
          </p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <div className="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all card-hover border border-gray-100 dark:border-gray-700 animate-slideInLeft">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <FaSearch className="text-4xl text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 dark:text-white bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Smart Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Find cafes by location, price, amenities, and opening hours with real-time filtering
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all card-hover border border-gray-100 dark:border-gray-700 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <FaMapMarkedAlt className="text-4xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 dark:text-white bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Interactive Maps
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Click anywhere on the map to discover cafes nearby with adjustable search radius
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all card-hover border border-gray-100 dark:border-gray-700 animate-slideInRight">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <FaCoffee className="text-4xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 dark:text-white bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Real Reviews
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Read authentic reviews and ratings from the community to make informed choices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-gradient">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg animate-bounceIn">
              <div className="text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
                15+
              </div>
              <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">Cafes Listed</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg animate-bounceIn" style={{ animationDelay: '0.1s' }}>
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                3
              </div>
              <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">Cities Covered</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg animate-bounceIn" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                100%
              </div>
              <div className="text-gray-700 dark:text-gray-300 text-lg font-medium">Free to Use</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;