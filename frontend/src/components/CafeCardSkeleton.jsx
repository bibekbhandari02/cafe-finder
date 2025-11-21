const CafeCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>

      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>

        {/* Location Skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>

        {/* Rating Skeleton */}
        <div className="flex justify-between mb-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default CafeCardSkeleton;
