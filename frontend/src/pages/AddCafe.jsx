import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AddCafe = () => {
  const { user } = useAuth();
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
      await axios.post('/api/cafes', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Cafe added successfully!');
      setFormData({
        name: '',
        description: '',
        street: '',
        city: '',
        lat: '',
        lng: '',
        priceRange: '₹',
        amenities: ''
      });
      setImage(null);
    } catch (error) {
      console.error(error.response?.data || error);
      alert('Failed to add cafe');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Add New Cafe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <input placeholder="Cafe Name" value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded" />

          <textarea placeholder="Description" value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded" />

          <input placeholder="Street" value={formData.street}
            onChange={e => setFormData({ ...formData, street: e.target.value })}
            className="w-full p-2 border rounded" />

          <input placeholder="City" value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            className="w-full p-2 border rounded" />

          <input placeholder="Latitude" value={formData.lat}
            onChange={e => setFormData({ ...formData, lat: e.target.value })}
            className="w-full p-2 border rounded" />

          <input placeholder="Longitude" value={formData.lng}
            onChange={e => setFormData({ ...formData, lng: e.target.value })}
            className="w-full p-2 border rounded" />

          <select value={formData.priceRange}
            onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
            className="w-full p-2 border rounded">
            <option value="₹">₹ Budget</option>
            <option value="₹₹">₹₹ Moderate</option>
            <option value="₹₹₹">₹₹₹ Expensive</option>
          </select>

          <input placeholder="Amenities (comma separated: WiFi, Parking)"
            value={formData.amenities}
            onChange={e => setFormData({ ...formData, amenities: e.target.value })}
            className="w-full p-2 border rounded" />

          <input type="file" accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="w-full p-2 border rounded" />

          <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded">
            Add Cafe
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCafe;
