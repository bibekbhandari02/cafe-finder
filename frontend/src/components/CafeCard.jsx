import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const CafeCard = ({ cafe }) => {
  // 👇 Fix double slash issue + ensure correct absolute URL
  const imageUrl = cafe.image?.startsWith("http")
    ? cafe.image
    : `http://localhost:5000${cafe.image}`; // cafe.image already starts with /uploads/...

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">

      {/* Cafe Image */}
      <img
        src={imageUrl}
        alt={cafe.name}
        className="w-full h-48 object-cover"
        onError={(e) => (e.target.src = "/fallback-cafe.jpg")} // Optional fallback
      />

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

        {/* Location */}
        <div className="flex items-center mb-3">
          <FaMapMarkerAlt className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {cafe?.address?.city}, {cafe?.address?.country}
          </span>
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

        {/* View Details Button */}
        <Link
          to={`/cafes/${cafe._id}`}
          className="block w-full text-center bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CafeCard;
