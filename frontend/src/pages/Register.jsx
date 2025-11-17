import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/cafes');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Register</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-white">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-white">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-white">Password</label>
            <input
              type="password"
              required
              minLength="6"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Register
          </button>
        </form>
        
        <p className="text-center mt-4 dark:text-white">
          Already have an account? <Link to="/login" className="text-amber-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;