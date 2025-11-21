import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaCoffee, FaMapMarkerAlt, FaDollarSign, FaImage, FaClock, FaStar, FaArrowLeft } from 'react-icons/fa';

const AddCafe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    street: '',
    city: '',
    lat: '',
    lng: '',
    priceRange: '₹',
    amenities: '',
    openingHours: {
      monday: '7:00 AM - 9:00 PM',
      tuesday: '7:00 AM - 9:00 PM',
      wednesday: '7:00 AM - 9:00 PM',
      thursday: '7:00 AM - 9:00 PM',
      friday: '7:00 AM - 10:00 PM',
      saturday: '7:00 AM - 10:00 PM',
      sunday: '7:00 AM - 9:00 PM'
    }
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('street', formData.street);
    data.append('city', formData.city);
    data.append('lat', formData.lat);
    data.append('lng', formData.lng);
    data.append('priceRange', formData.priceRange);
    data.append('amenities', formData.amenities);
    data.append('openingHours', JSON.stringify(formData.openingHours));
    if (image) data.append('image', image);

    try {
      await axios.post('/api/cafes', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Cafe added successfully!');
      navigate('/admin');
    } catch (error) {
      console.error(error.response?.data || error);
      alert('Failed to add cafe');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 animate-fadeIn">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors mb-4"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
          <FaCoffee className="text-amber-600" />
          Add New Cafe
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
          Fill in the details to add a new cafe to your collection
        </p>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700 animate-slideInLeft">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <FaCoffee className="text-amber-600" />
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Cafe Name *
              </label>
              <input
                required
                placeholder="Enter cafe name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-amber-500 dark:focus:border-amber-500 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <textarea
                required
                rows="4"
                placeholder="Describe the cafe atmosphere, specialties, etc."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-amber-500 dark:focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <FaMapMarkerAlt className="text-blue-600" />
              Location Details
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Street Address *
                </label>
                <input
                  required
                  placeholder="Street address"
                  value={formData.street}
                  onChange={e => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  City *
                </label>
                <input
                  required
                  placeholder="City name"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Latitude *
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  placeholder="27.7172"
                  value={formData.lat}
                  onChange={e => setFormData({ ...formData, lat: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Longitude *
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  placeholder="85.3240"
                  value={formData.lng}
                  onChange={e => setFormData({ ...formData, lng: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <FaDollarSign className="text-green-600" />
              Pricing & Amenities
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Price Range *
                </label>
                <select
                  value={formData.priceRange}
                  onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-green-500 dark:focus:border-green-500 transition-all shadow-sm"
                >
                  <option value="₹">₹ Budget Friendly</option>
                  <option value="₹₹">₹₹ Moderate</option>
                  <option value="₹₹₹">₹₹₹ Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Amenities
                </label>
                <input
                  placeholder="WiFi, Parking, Live Music"
                  value={formData.amenities}
                  onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-green-500 dark:focus:border-green-500 transition-all shadow-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate with commas</p>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <FaImage className="text-purple-600" />
              Cafe Image
            </h3>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 transition-all shadow-sm"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <FaClock className="text-indigo-600" />
              Opening Hours
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.keys(formData.openingHours).map(day => (
                <div key={day}>
                  <label className="block text-sm font-semibold capitalize mb-2 text-gray-700 dark:text-gray-300">
                    {day}
                  </label>
                  <input
                    type="text"
                    placeholder="9:00 AM - 5:00 PM"
                    value={formData.openingHours[day]}
                    onChange={e => setFormData({
                      ...formData,
                      openingHours: { ...formData.openingHours, [day]: e.target.value }
                    })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500 transition-all shadow-sm text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-6 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-medium shadow-lg btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding Cafe...' : 'Add Cafe'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="flex-1 sm:flex-none bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition-all font-medium shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCafe;
