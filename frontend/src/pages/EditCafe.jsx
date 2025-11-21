import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCafe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    street: '',
    city: '',
    lat: '',
    lng: '',
    priceRange: '₹',
    amenities: ''
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCafe();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const fetchCafe = async () => {
    try {
      const { data } = await axios.get(`/api/cafes/${id}`);
      setFormData({
        name: data.name,
        description: data.description,
        street: data.address.street,
        city: data.address.city,
        lat: data.address.coordinates.lat,
        lng: data.address.coordinates.lng,
        priceRange: data.priceRange,
        amenities: data.amenities.join(', ')
      });
      setCurrentImage(data.image);
    } catch (error) {
      console.error('Error fetching cafe:', error);
      alert('Failed to load cafe');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('street', formData.street);
    data.append('city', formData.city);
    data.append('lat', formData.lat);
    data.append('lng', formData.lng);
    data.append('priceRange', formData.priceRange);
    data.append('amenities', formData.amenities);
    if (image) data.append('image', image);

    try {
      await axios.put(`/api/cafes/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Cafe updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error(error.response?.data || error);
      alert('Failed to update cafe');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Edit Cafe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <input 
            placeholder="Cafe Name" 
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
          />

          <textarea 
            placeholder="Description" 
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
          />

          <input 
            placeholder="Street" 
            value={formData.street}
            onChange={e => setFormData({ ...formData, street: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
          />

          <input 
            placeholder="City" 
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
          />

          <input 
            placeholder="Latitude" 
            value={formData.lat}
            onChange={e => setFormData({ ...formData, lat: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
          />

          <input 
            placeholder="Longitude" 
            value={formData.lng}
            onChange={e => setFormData({ ...formData, lng: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
          />

          <select 
            value={formData.priceRange}
            onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="₹">₹ Budget</option>
            <option value="₹₹">₹₹ Moderate</option>
            <option value="₹₹₹">₹₹₹ Expensive</option>
          </select>

          <input 
            placeholder="Amenities (comma separated: WiFi, Parking)"
            value={formData.amenities}
            onChange={e => setFormData({ ...formData, amenities: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
          />

          {currentImage && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Image:</p>
              <img 
                src={getImageUrl(currentImage)} 
                alt="Current" 
                className="h-32 w-32 object-cover rounded"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}

          <input 
            type="file" 
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" 
          />

          <div className="flex gap-4">
            <button 
              type="submit" 
              className="flex-1 bg-amber-600 text-white py-2 rounded hover:bg-amber-700"
            >
              Update Cafe
            </button>
            <button 
              type="button"
              onClick={() => navigate('/admin')}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCafe;
