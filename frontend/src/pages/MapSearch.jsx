import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaStar, FaSearch, FaLocationArrow } from 'react-icons/fa';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapSearch = () => {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [searchRadius, setSearchRadius] = useState(3); // km - default 3km
  const [showMobileList, setShowMobileList] = useState(false);
  const [mapCenter, setMapCenter] = useState([27.7172, 85.3240]); // Kathmandu
  const [searchCenter, setSearchCenter] = useState(null); // Track where user clicked
  const [loading, setLoading] = useState(true);
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);
  const userLocationMarkerRef = useRef(null);

  useEffect(() => {
    fetchCafes();
  }, []);

  useEffect(() => {
    // Initialize map after component mounts and ref is available
    if (!loading && mapRef.current && !mapInstance.current) {
      initializeMap();
    }
  }, [loading]);

  useEffect(() => {
    if (mapInstance.current && cafes.length > 0) {
      updateMarkers();
    }
  }, [cafes, filteredCafes]);

  // Update search circle and results when radius changes
  useEffect(() => {
    if (searchCenter && mapInstance.current && cafes.length > 0) {
      searchNearby(searchCenter[0], searchCenter[1]);
    }
  }, [searchRadius, searchCenter, cafes]);

  const fetchCafes = async () => {
    try {
      const { data } = await axios.get('/api/cafes');
      console.log('Fetched cafes:', data); // Debug log
      // Ensure data is an array
      const cafesArray = Array.isArray(data) ? data : [];
      setCafes(cafesArray);
      setFilteredCafes(cafesArray);
    } catch (error) {
      console.error('Error fetching cafes:', error);
      console.error('Error details:', error.response?.data);
      setCafes([]);
      setFilteredCafes([]);
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView(mapCenter, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstance.current);

      // Add click event to search by location
      mapInstance.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setMapCenter([lat, lng]);
        setSearchCenter([lat, lng]);
        searchNearby(lat, lng);
      });
    }
  };

  const searchNearby = (lat, lng) => {
    if (!mapInstance.current) return;

    // Remove existing circle
    if (circleRef.current) {
      mapInstance.current.removeLayer(circleRef.current);
    }

    // Add search radius circle
    circleRef.current = L.circle([lat, lng], {
      color: '#f59e0b',
      fillColor: '#fbbf24',
      fillOpacity: 0.2,
      radius: searchRadius * 1000 // Convert km to meters
    }).addTo(mapInstance.current);

    // Filter cafes within radius
    const nearby = cafes.filter(cafe => {
      const distance = calculateDistance(
        lat, lng,
        cafe.address.coordinates.lat,
        cafe.address.coordinates.lng
      );
      return distance <= searchRadius;
    });

    setFilteredCafes(nearby);
    
    // Pan to location without changing zoom
    mapInstance.current.panTo([lat, lng]);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const updateMarkers = () => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add markers for filtered cafes
    filteredCafes.forEach(cafe => {
      const marker = L.marker([
        cafe.address.coordinates.lat,
        cafe.address.coordinates.lng
      ]).addTo(mapInstance.current);

      marker.bindPopup(`
        <div class="p-2 min-w-[200px]">
          <h3 class="font-bold text-lg mb-1">${cafe.name}</h3>
          <p class="text-sm text-gray-600 mb-1">📍 ${cafe.address.street}, ${cafe.address.city}</p>
          <p class="text-sm mb-2">⭐ ${cafe.avgRating.toFixed(1)} (${cafe.reviewCount} reviews)</p>
          <p class="text-sm font-semibold text-amber-600">${cafe.priceRange}</p>
          <a href="/cafes/${cafe._id}" class="text-blue-600 text-sm hover:underline">View Details →</a>
        </div>
      `);

      marker.on('click', () => {
        setSelectedCafe(cafe);
      });

      markersRef.current.push(marker);
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setSearchCenter([latitude, longitude]);
          if (mapInstance.current) {
            // Remove existing user location marker
            if (userLocationMarkerRef.current) {
              mapInstance.current.removeLayer(userLocationMarkerRef.current);
            }

            // Create custom icon for user location
            const userIcon = L.divIcon({
              className: 'user-location-marker',
              html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            // Add user location marker
            userLocationMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
              .addTo(mapInstance.current)
              .bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold text-blue-600">📍 Your Location</h3>
                  <p class="text-sm">You are here</p>
                </div>
              `);

            // Get current zoom or use 14 as default
            const currentZoom = mapInstance.current.getZoom();
            mapInstance.current.setView([latitude, longitude], currentZoom > 10 ? currentZoom : 14);
            searchNearby(latitude, longitude);
          }
        },
        () => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const resetSearch = () => {
    setFilteredCafes(cafes);
    setSearchCenter(null);
    if (circleRef.current && mapInstance.current) {
      mapInstance.current.removeLayer(circleRef.current);
      circleRef.current = null;
    }
    if (userLocationMarkerRef.current && mapInstance.current) {
      mapInstance.current.removeLayer(userLocationMarkerRef.current);
      userLocationMarkerRef.current = null;
    }
    if (mapInstance.current) {
      mapInstance.current.setView([27.7172, 85.3240], 12);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      // Return a data URL for inline SVG placeholder
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';
    }
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-amber-600">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Controls - Fixed below navbar */}
      <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl p-3 sm:p-5 z-40 border-b-2 border-amber-200 dark:border-amber-800">
        <div className="container mx-auto flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 animate-slideInLeft w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                <FaMapMarkerAlt className="text-white text-sm sm:text-base" />
              </div>
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Map Search
              </span>
            </h1>
            <span className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold border border-green-200 dark:border-green-800 shadow-md">
              {filteredCafes.length} cafe(s)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 animate-slideInRight w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <label className="text-xs sm:text-sm font-semibold dark:text-white whitespace-nowrap">📏 Radius:</label>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:border-amber-500 transition-all font-medium text-xs sm:text-sm"
              >
                <option value={0.5}>500m</option>
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={3}>3 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
              </select>
            </div>

            <button
              onClick={getCurrentLocation}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-5 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 font-medium shadow-lg btn-hover-lift text-xs sm:text-sm"
            >
              <FaLocationArrow className="text-xs sm:text-sm" /> 
              <span className="hidden sm:inline">My Location</span>
              <span className="sm:hidden">Location</span>
            </button>

            <button
              onClick={resetSearch}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 sm:px-5 py-2 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all font-medium shadow-lg btn-hover-lift text-xs sm:text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="container mx-auto mt-3 sm:mt-4 animate-fadeIn">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm">
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
              <span className="text-base sm:text-lg">💡</span>
              <span className="hidden sm:inline">Click anywhere on the map to search for cafes in that area</span>
              <span className="sm:hidden">Tap map to search cafes</span>
            </p>
          </div>
        </div>
      </div>

      {/* Map and Sidebar - Account for fixed navbar and controls */}
      <div className="fixed inset-0 top-16 flex overflow-hidden">
        {/* Spacer for controls */}
        <div className="absolute top-0 left-0 right-0 h-32 sm:h-36 pointer-events-none z-30" />
        
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="h-full w-full cursor-crosshair" />
        </div>

        {/* Sidebar - Hidden on mobile by default, shown on larger screens */}
        <div className="hidden md:block w-80 lg:w-96 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-y-auto border-l-2 border-amber-200 dark:border-amber-800 pt-32 sm:pt-36">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 dark:text-white flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">📍</span>
              Cafes in Area
            </h2>

            {filteredCafes.length === 0 ? (
              <div className="text-center py-16 animate-bounceIn">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FaSearch className="text-5xl text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No cafes found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Try increasing the search radius</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCafes.map((cafe, index) => (
                  <Link
                    key={cafe._id}
                    to={`/cafes/${cafe._id}`}
                    className={`block bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-2xl transition-all border-2 animate-slideInRight ${
                      selectedCafe?._id === cafe._id 
                        ? 'border-amber-500 shadow-xl scale-105' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => {
                      setSelectedCafe(cafe);
                      if (mapInstance.current) {
                        mapInstance.current.setView([
                          cafe.address.coordinates.lat,
                          cafe.address.coordinates.lng
                        ], 15);
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <img
                          src={getImageUrl(cafe.image)}
                          alt={cafe.name}
                          className="w-24 h-24 object-cover rounded-xl shadow-md"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';
                            e.target.onerror = null;
                          }}
                        />
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                          {cafe.priceRange}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg dark:text-white mb-1">{cafe.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                          📍 {cafe.address.street}, {cafe.address.city}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-2 py-1 rounded-lg text-xs flex items-center gap-1 font-semibold border border-yellow-200 dark:border-yellow-800">
                            <FaStar className="text-yellow-500 dark:text-yellow-400" />
                            <span className="text-gray-900 dark:text-yellow-100">{cafe.avgRating.toFixed(1)}</span>
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({cafe.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const { lat, lng } = cafe.address.coordinates;
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                      }}
                      className="mt-3 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all text-sm flex items-center justify-center gap-2 font-medium shadow-lg btn-hover-lift"
                    >
                      <FaMapMarkerAlt /> Get Directions
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Floating Button */}
        <button
          onClick={() => setShowMobileList(!showMobileList)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-full shadow-2xl z-30 btn-hover-lift"
        >
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-xl" />
            <span className="font-bold">{filteredCafes.length}</span>
          </div>
        </button>

        {/* Mobile Bottom Sheet */}
        {showMobileList && (
          <>
            <div 
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
              onClick={() => setShowMobileList(false)}
            />
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl z-50 max-h-[70vh] overflow-hidden animate-slideInLeft">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  {filteredCafes.length} Cafes Found
                </h2>
                <button
                  onClick={() => setShowMobileList(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(70vh-80px)] p-4">
                {filteredCafes.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <FaSearch className="text-5xl text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No cafes found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Try increasing the search radius</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredCafes.map((cafe) => (
                      <Link
                        key={cafe._id}
                        to={`/cafes/${cafe._id}`}
                        className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-3 hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-600"
                        onClick={() => setShowMobileList(false)}
                      >
                        <div className="flex gap-3">
                          <img
                            src={getImageUrl(cafe.image)}
                            alt={cafe.name}
                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';
                              e.target.onerror = null;
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-base dark:text-white mb-1">{cafe.name}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                              📍 {cafe.address.street}, {cafe.address.city}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-2 py-1 rounded-lg text-xs flex items-center gap-1 font-semibold border border-yellow-200 dark:border-yellow-800">
                                <FaStar className="text-yellow-500 dark:text-yellow-400" />
                                <span className="text-gray-900 dark:text-yellow-100">{cafe.avgRating.toFixed(1)}</span>
                              </span>
                              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                {cafe.priceRange}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MapSearch;
