import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaClock } from 'react-icons/fa';
import { isOpenNow, getTodayHours } from '../utils/cafeUtils';

const CafeCard = ({ cafe }) => {
  const imageUrl = cafe.image 
    ? (cafe.image.startsWith("http") ? cafe.image : `http://localhost:5000${cafe.image}`)
    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';

  const open = isOpenNow(cafe.openingHours);
  const todayHours = getTodayHours(cafe.openingHours);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      {/* Cafe Image with Open Badge */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={cafe.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';
            e.target.onerror = null;
          }}
        />
        {open !== null && (
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            open ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            <FaClock className="text-xs" />
            {open ? 'Open Now' : 'Closed'}
          </div>
        )}
      </div>

      <div className="p-6">

        {/* Name + Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {cafe.name}
          </h3>
          <span className="text-amber-600 font-semibold">
            {cafe.priceRange}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {cafe.description}
        </p>

        {/* Location & Hours */}
        <div className="space-y-2 mb-3">
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-gray-400 mr-2 flex-shrink-0 mt-1" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {cafe?.address?.street}, {cafe?.address?.city}
            </span>
          </div>
          <div className="flex items-center">
            <FaClock className="text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {todayHours}
            </span>
          </div>
        </div>

        {/* Rating + Amenities */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-semibold">{cafe.avgRating}</span>
            <span className="text-gray-500 ml-1">({cafe.reviewCount})</span>
          </div>

          <div className="flex gap-2">
            {cafe.amenities?.slice(0, 2).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/cafes/${cafe._id}`}
            className="flex-1 text-center bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition"
          >
            View Details
          </Link>
          <button
            onClick={() => {
              const { lat, lng } = cafe.address.coordinates;
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            title="Get Directions"
          >
            <FaMapMarkerAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CafeCard;
