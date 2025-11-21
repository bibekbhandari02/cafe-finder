import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCoffee, FaMapMarkedAlt, FaCompass, FaUser, FaSignOutAlt, FaTachometerAlt, FaPlus, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-xl sm:text-2xl font-bold text-amber-600 hover:text-amber-700 transition flex items-center gap-2 group"
            >
              <FaCoffee className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                CafeFinder
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-2 items-center">
              <Link 
                to="/cafes" 
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isActive('/cafes')
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <FaCompass className="text-sm" />
                Explore
              </Link>
              
              <Link 
                to="/map" 
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isActive('/map')
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                }`}
              >
                <FaMapMarkedAlt className="text-sm" />
                Map
              </Link>
              
              {user?.isAdmin ? (
                <>
                  <Link 
                    to="/admin" 
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isActive('/admin')
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                    }`}
                  >
                    <FaTachometerAlt className="text-sm" />
                    Dashboard
                  </Link>
                  
                  <Link 
                    to="/add-cafe" 
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isActive('/add-cafe')
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                    }`}
                  >
                    <FaPlus className="text-sm" />
                    Add Cafe
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all btn-hover-lift font-medium flex items-center gap-2 shadow-md"
                  >
                    <FaSignOutAlt className="text-sm" />
                    Logout
                  </button>
                </>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium dark:text-white">{user.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 animate-scaleIn border border-gray-200 dark:border-gray-700">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors"
                      >
                        <FaUser className="text-amber-600" />
                        Profile
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all btn-hover-lift font-medium shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <FaTimes className="text-2xl text-gray-700 dark:text-white" />
              ) : (
                <FaBars className="text-2xl text-gray-700 dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fadeIn"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FaCoffee className="text-2xl text-amber-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                CafeFinder
              </span>
            </div>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <FaTimes className="text-xl text-gray-700 dark:text-white" />
            </button>
          </div>

          {/* User Info (if logged in) */}
          {user && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <Link 
              to="/cafes" 
              className={`flex items-center gap-3 px-6 py-4 font-medium transition-all ${
                isActive('/cafes')
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-l-4 border-amber-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
              }`}
            >
              <FaCompass className="text-xl" />
              <span>Explore Cafes</span>
            </Link>
            
            <Link 
              to="/map" 
              className={`flex items-center gap-3 px-6 py-4 font-medium transition-all ${
                isActive('/map')
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-l-4 border-blue-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
              }`}
            >
              <FaMapMarkedAlt className="text-xl" />
              <span>Map Search</span>
            </Link>

            {user?.isAdmin && (
              <>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-6" />
                <Link 
                  to="/admin" 
                  className={`flex items-center gap-3 px-6 py-4 font-medium transition-all ${
                    isActive('/admin')
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-l-4 border-purple-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                  }`}
                >
                  <FaTachometerAlt className="text-xl" />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  to="/add-cafe" 
                  className={`flex items-center gap-3 px-6 py-4 font-medium transition-all ${
                    isActive('/add-cafe')
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-l-4 border-green-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                  }`}
                >
                  <FaPlus className="text-xl" />
                  <span>Add Cafe</span>
                </Link>
              </>
            )}

            {user && !user.isAdmin && (
              <>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-6" />
                <Link 
                  to="/profile" 
                  className={`flex items-center gap-3 px-6 py-4 font-medium transition-all ${
                    isActive('/profile')
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-l-4 border-amber-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
                  }`}
                >
                  <FaUser className="text-xl" />
                  <span>My Profile</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                <FaSignOutAlt />
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/login" 
                  className="block w-full text-center px-6 py-3 rounded-xl font-medium border-2 border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-medium shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;