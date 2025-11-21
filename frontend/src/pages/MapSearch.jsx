import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
      setCafes(data);
      setFilteredCafes(data);
    } catch (error) {
      console.error('Error fetching cafes:', error);
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
    <div className="h-screen flex flex-col pt-16">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 shadow-lg p-4 z-10">
        <div className="container mx-auto flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
              <FaMapMarkerAlt className="text-amber-600" />
              Map Search
            </h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredCafes.length} cafe(s) found
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium dark:text-white">Radius:</label>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white"
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FaLocationArrow /> My Location
            </button>

            <button
              onClick={resetSearch}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="container mx-auto mt-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 Click anywhere on the map to search for cafes in that area
          </p>
        </div>
      </div>

      {/* Map and Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="h-full w-full cursor-crosshair" />
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-white dark:bg-gray-800 overflow-y-auto border-l border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Cafes in Area
            </h2>

            {filteredCafes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaSearch className="text-4xl mx-auto mb-2" />
                <p>No cafes found in this area</p>
                <p className="text-sm mt-2">Try increasing the search radius</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCafes.map(cafe => (
                  <Link
                    key={cafe._id}
                    to={`/cafes/${cafe._id}`}
                    className={`block bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:shadow-lg transition ${
                      selectedCafe?._id === cafe._id ? 'ring-2 ring-amber-500' : ''
                    }`}
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
                      <img
                        src={getImageUrl(cafe.image)}
                        alt={cafe.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';
                          e.target.onerror = null;
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-bold dark:text-white">{cafe.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {cafe.address.street}, {cafe.address.city}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm flex items-center gap-1">
                            <FaStar className="text-yellow-400" />
                            {cafe.avgRating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({cafe.reviewCount})
                          </span>
                          <span className="text-sm font-semibold text-amber-600">
                            {cafe.priceRange}
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
                      className="mt-2 w-full bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2"
                    >
                      <FaMapMarkerAlt /> Directions
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSearch;
