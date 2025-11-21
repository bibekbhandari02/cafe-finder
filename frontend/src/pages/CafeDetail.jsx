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
    return (
      <div className="container mx-auto px-6 py-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">☕</div>
          <div className="text-2xl font-bold text-amber-600 animate-pulse">Loading cafe details...</div>
        </div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="container mx-auto px-6 py-8 flex justify-center items-center min-h-screen">
        <div className="text-center animate-bounceIn">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Cafe not found</div>
          <p className="text-gray-600 dark:text-gray-400">The cafe you're looking for doesn't exist</p>
        </div>
      </div>
    );
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
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-6 animate-fadeIn group">
            <img 
              src={imageUrl}
              alt={cafe.name}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" fill="%23ffffff"%3ECafe Image%3C/text%3E%3C/svg%3E';
                e.target.onerror = null;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">{cafe.name}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="bg-white/90 backdrop-blur-sm text-amber-600 px-4 py-2 rounded-full text-xl font-bold shadow-lg">
                  {cafe.priceRange}
                </span>
                {isOpenNow(cafe.openingHours) !== null && (
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${
                    isOpenNow(cafe.openingHours) 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {isOpenNow(cafe.openingHours) ? '🟢 Open Now' : '🔴 Closed'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 border border-gray-100 dark:border-gray-700 animate-slideInLeft">
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-base sm:text-lg leading-relaxed">{cafe.description}</p>
            
            <div className="flex items-center gap-2 mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 px-4 py-3 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <FaStar className="text-yellow-400 dark:text-yellow-300 text-2xl" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{cafe.avgRating}</span>
              <span className="text-gray-600 dark:text-gray-300 font-medium">({cafe.reviewCount} reviews)</span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-3 dark:text-white flex items-center gap-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  Address
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {cafe.address.street}<br />
                  {cafe.address.city}, {cafe.address.country}
                </p>
                <button
                  onClick={() => {
                    const { lat, lng } = cafe.address.coordinates;
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg btn-hover-lift"
                >
                  <FaMapMarkerAlt /> Get Directions
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg sm:text-xl font-bold mb-3 dark:text-white flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">✨</span>
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {cafe.amenities.map(amenity => (
                    <span key={amenity} className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-300 px-4 py-2 rounded-full text-sm flex items-center gap-2 font-medium border border-amber-200 dark:border-amber-800 shadow-sm">
                      {amenityIcons[amenity] || '•'} {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Opening Hours Section */}
            {cafe.openingHours && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mt-6 border border-gray-100 dark:border-gray-700 animate-slideInRight">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-5">
                  <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                      <FaClock className="text-white" />
                    </div>
                    Opening Hours
                  </h3>
                  {isOpenNow(cafe.openingHours) !== null && (
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                      isOpenNow(cafe.openingHours) 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    }`}>
                      {isOpenNow(cafe.openingHours) ? '🟢 Open Now' : '🔴 Closed'}
                    </span>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                  {Object.entries(cafe.openingHours).map(([day, hours]) => {
                    const isToday = day.toLowerCase() === ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
                    return (
                      <div 
                        key={day} 
                        className={`flex justify-between p-3 rounded-xl transition-all ${
                          isToday
                            ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 font-bold border-2 border-amber-300 dark:border-amber-700 shadow-md'
                            : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="capitalize dark:text-white flex items-center gap-2">
                          {isToday && <span className="text-amber-600">📍</span>}
                          {day}
                        </span>
                        <span className={`${isToday ? 'text-amber-700 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          {hours}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700 animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 dark:text-white flex items-center gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl">💬</span>
              Reviews
            </h2>
            
            {user && (
              <form onSubmit={handleReviewSubmit} className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800 shadow-md">
                <h3 className="font-bold text-base sm:text-lg mb-4 dark:text-white flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">✍️</span>
                  Write a Review
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-700">⭐ Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-800 dark:text-white focus:border-amber-500 transition-all shadow-sm"
                  >
                    <option value="5">★★★★★ Excellent</option>
                    <option value="4">★★★★☆ Good</option>
                    <option value="3">★★★☆☆ Average</option>
                    <option value="2">★★☆☆☆ Poor</option>
                    <option value="1">★☆☆☆☆ Terrible</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 dark:text-white text-gray-700">💭 Comment</label>
                  <textarea
                    required
                    rows="4"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Share your experience..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-800 dark:text-white focus:border-amber-500 transition-all shadow-sm"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-medium shadow-lg btn-hover-lift"
                >
                  Submit Review
                </button>
              </form>
            )}
            
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div 
                  key={review._id} 
                  className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all animate-slideInLeft"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {review.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold dark:text-white block">{review.user.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                </div>
              ))}
              
              {reviews.length === 0 && (
                <div className="text-center py-12 animate-bounceIn">
                  <div className="text-5xl mb-3">💭</div>
                  <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No reviews yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-24 animate-slideInRight">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🗺️</span>
                Location
              </h2>
              <MapView cafes={[cafe]} selectedCafe={cafe} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetail;
