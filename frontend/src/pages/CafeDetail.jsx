import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaWifi, FaParking, FaMusic, FaClock } from 'react-icons/fa';
import MapView from '../components/MapView';
import { FaMapMarkerAlt } from "react-icons/fa";
import { isOpenNow, getTodayHours } from '../utils/cafeUtils';

const CafeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchCafe();
    fetchReviews();
  }, [id]);

  const fetchCafe = async () => {
    try {
      const { data } = await axios.get(`/api/cafes/${id}`);
      setCafe(data);
    } catch (error) {
      console.error('Error fetching cafe:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/reviews/cafe/${id}`);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', { cafe: id, ...newReview });
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
      fetchCafe();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add review');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-8 text-center">Loading...</div>;
  }

  if (!cafe) {
    return <div className="container mx-auto px-6 py-8">Cafe not found</div>;
  }

  const amenityIcons = {
    'WiFi': <FaWifi />,
    'Parking': <FaParking />,
    'Live Music': <FaMusic />,
  };

  const imageUrl = cafe.image 
    ? (cafe.image.startsWith("http") ? cafe.image : `http://localhost:5000${cafe.image}`)
    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" fill="%23ffffff"%3ECafe Image%3C/text%3E%3C/svg%3E';

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img 
            src={imageUrl}
            alt={cafe.name}
            className="w-full h-96 object-cover rounded-xl shadow-lg mb-6"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" fill="%23ffffff"%3ECafe Image%3C/text%3E%3C/svg%3E';
              e.target.onerror = null;
            }}
          />
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold dark:text-white">{cafe.name}</h1>
              <span className="text-2xl text-amber-600 font-bold">{cafe.priceRange}</span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">{cafe.description}</p>
            
            <div className="flex items-center mb-4">
              <FaStar className="text-yellow-400 mr-2" />
              <span className="text-xl font-semibold dark:text-white">{cafe.avgRating}</span>
              <span className="text-gray-500 ml-2 dark:text-gray-400">({cafe.reviewCount} reviews)</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white flex items-center">
                  <FaMapMarkerAlt className="mr-2" /> Address
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {cafe.address.street}<br />
                  {cafe.address.city}, {cafe.address.country}
                </p>
                <button
                  onClick={() => {
                    const { lat, lng } = cafe.address.coordinates;
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <FaMapMarkerAlt /> Get Directions
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {cafe.amenities.map(amenity => (
                    <span key={amenity} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {amenityIcons[amenity] || '•'} {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Opening Hours Section */}
            {cafe.openingHours && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                    <FaClock /> Opening Hours
                  </h3>
                  {isOpenNow(cafe.openingHours) !== null && (
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isOpenNow(cafe.openingHours) ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {isOpenNow(cafe.openingHours) ? 'Open Now' : 'Closed'}
                    </span>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(cafe.openingHours).map(([day, hours]) => (
                    <div key={day} className={`flex justify-between p-2 rounded ${
                      day.toLowerCase() === ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()]
                        ? 'bg-amber-50 dark:bg-amber-900/20 font-semibold'
                        : ''
                    }`}>
                      <span className="capitalize dark:text-white">{day}</span>
                      <span className="text-gray-600 dark:text-gray-400">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Reviews</h2>
            
            {user && (
              <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-4 dark:text-white">Write a Review</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 dark:text-white">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                  >
                    <option value="5">★★★★★ Excellent</option>
                    <option value="4">★★★★☆ Good</option>
                    <option value="3">★★★☆☆ Average</option>
                    <option value="2">★★☆☆☆ Poor</option>
                    <option value="1">★☆☆☆☆ Terrible</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 dark:text-white">Comment</label>
                  <textarea
                    required
                    rows="3"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                
                <button
                  type="submit"
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  Submit Review
                </button>
              </form>
            )}
            
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold dark:text-white">{review.user.name}</span>
                    <span className="text-yellow-400">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              
              {reviews.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Location</h2>
            <MapView cafes={[cafe]} selectedCafe={cafe} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetail;
