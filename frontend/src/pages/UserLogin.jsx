import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      navigate('/cafes');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/cafes');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Welcome Back</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Login to explore cafes
        </p>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-white">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-white">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Login
          </button>
        </form>
        
        <p className="text-center mt-4 dark:text-white">
          Don't have an account? <Link to="/register" className="text-amber-600 hover:underline">Sign Up</Link>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Are you an admin? <Link to="/admin/login" className="text-blue-600 hover:underline">Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
