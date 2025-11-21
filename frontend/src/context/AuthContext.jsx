import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Setup axios interceptor to handle token expiration
let isInterceptorSetup = false;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setup axios interceptor once
    if (!isInterceptorSetup) {
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            // Token expired or invalid
            console.log('🔒 Session expired, logging out...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
          }
          return Promise.reject(error);
        }
      );
      isInterceptorSetup = true;
    }

    checkAuth();

    // Re-check auth when window regains focus (user comes back to tab)
    const handleFocus = () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const { data } = await axios.get('/api/auth/me');
        setUser(data);
        console.log('✅ Session restored:', data.name);
      } catch (error) {
        console.error('❌ Session expired or invalid');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      console.log('✅ User logged in:', data.user.name);
      return data;
    } catch (error) {
      // Clear any existing auth data on login failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      throw error;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/admin/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      console.log('✅ Admin logged in:', data.user.name);
      return data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      console.log('✅ User registered:', data.user.name);
      return data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    console.log('👋 User logged out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    adminLogin,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};