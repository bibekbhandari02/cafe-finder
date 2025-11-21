import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaClock } from 'react-icons/fa';
import { isOpenNow, getTodayHours } from '../utils/cafeUtils';
import { getImageUrl } from '../utils/imageUtils';

const CafeCard = ({ cafe }) => {
  const imageUrl = getImageUrl(cafe.image);

  const open = isOpenNow(cafe.openingHours);
  const todayHours = getTodayHours(cafe.openingHours);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100 dark:border-gray-700">

      {/* Cafe Image with Open Badge */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={cafe.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';
            e.target.onerror = null;
          }}
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {open !== null && (
          <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm ${
            open 
              ? 'bg-green-500/90 text-white animate-pulse' 
              : 'bg-red-500/90 text-white'
          }`}>
            <FaClock className="text-xs" />
            {open ? 'Open Now' : 'Closed'}
          </div>
        )}
        
        {/* Price badge */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-amber-600 font-bold text-sm">
            {cafe.priceRange}
          </span>
        </div>
      </div>

      <div className="p-6">

        {/* Name + Rating */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
            {cafe.name}
          </h3>
          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <FaStar className="text-yellow-500 dark:text-yellow-400 text-sm" />
            <span className="font-bold text-sm text-gray-900 dark:text-yellow-100">{cafe.avgRating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">
          {cafe.description}
        </p>

        {/* Location & Hours */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-start group/location">
            <FaMapMarkerAlt className="text-amber-500 mr-2 flex-shrink-0 mt-1 group-hover/location:scale-110 transition-transform" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {cafe?.address?.street}, {cafe?.address?.city}
            </span>
          </div>
          <div className="flex items-center group/hours">
            <FaClock className="text-blue-500 mr-2 flex-shrink-0 group-hover/hours:rotate-180 transition-transform duration-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {todayHours}
            </span>
          </div>
        </div>

        {/* Amenities + Review Count */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex gap-1.5">
            {cafe.amenities?.slice(0, 2).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full font-medium border border-amber-200 dark:border-amber-800"
              >
                {amenity}
              </span>
            ))}
            {cafe.amenities?.length > 2 && (
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full font-medium">
                +{cafe.amenities.length - 2}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {cafe.reviewCount} reviews
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/cafes/${cafe._id}`}
            className="flex-1 text-center bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2.5 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-medium shadow-md hover:shadow-lg btn-hover-lift"
          >
            View Details
          </Link>
          <button
            onClick={() => {
              const { lat, lng } = cafe.address.coordinates;
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg btn-hover-lift"
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
