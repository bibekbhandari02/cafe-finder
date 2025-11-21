import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-amber-600">☕ CafeFinder</Link>
        
        <div className="flex space-x-6 items-center">
          <Link to="/cafes" className="hover:text-amber-600 transition dark:text-white">Explore</Link>
          <Link to="/map" className="hover:text-amber-600 transition dark:text-white">Map</Link>
          
          {user?.isAdmin ? (
            // Admin Navigation
            <>
              <Link to="/admin" className="hover:text-amber-600 transition dark:text-white">Dashboard</Link>
              <Link to="/add-cafe" className="hover:text-amber-600 transition dark:text-white">Add Cafe</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : user ? (
            // Regular User Navigation
            <>
              <Link to="/profile" className="hover:text-amber-600 transition dark:text-white">Profile</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            // Guest Navigation
            <>
              <Link to="/login" className="hover:text-amber-600 transition dark:text-white">Login</Link>
              <Link 
                to="/register" 
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;