import axios from 'axios';

// Backend API URL - Change this to your deployed backend URL
const API_BASE_URL = 'https://cafe-finder-backend-fr45.onrender.com';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
export { API_BASE_URL };
