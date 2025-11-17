import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaWifi, FaParking, FaMusic } from 'react-icons/fa';
import MapView from '../components/MapView';
import { FaMapMarkerAlt } from "react-icons/fa";

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

  // Fix image URL for backend uploads
  const imageUrl = cafe.image?.startsWith("http")
    ? cafe.image
    : `http://localhost:5000${cafe.image}`;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img 
            src={imageUrl}
            alt={cafe.name}
            className="w-full h-96 object-cover rounded-xl shadow-lg mb-6"
            onError={(e) => (e.target.src = "/fallback-cafe.jpg")}
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
                <p className="text-gray-600 dark:text-gray-300">
                  {cafe.address.street}<br />
                  {cafe.address.city}, {cafe.address.country}
                </p>
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
