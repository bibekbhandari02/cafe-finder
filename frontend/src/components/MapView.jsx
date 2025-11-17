import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapView = ({ cafes, selectedCafe }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([27.6667, 85.3167], 7);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Add markers for each cafe
    cafes.forEach(cafe => {
      const marker = L.marker([cafe.address.coordinates.lat, cafe.address.coordinates.lng])
        .addTo(mapInstance.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${cafe.name}</h3>
            <p class="text-sm">${cafe.address.city}</p>
            <p class="text-sm">★ ${cafe.avgRating} (${cafe.reviewCount} reviews)</p>
          </div>
        `);
      
      if (selectedCafe?._id === cafe._id) {
        marker.openPopup();
      }
    });

    // Focus on selected cafe
    if (selectedCafe) {
      mapInstance.current.setView([
        selectedCafe.address.coordinates.lat,
        selectedCafe.address.coordinates.lng
      ], 13);
    }
  }, [cafes, selectedCafe]);

  return <div ref={mapRef} className="h-96 w-full rounded-xl shadow-lg" />;
};

export default MapView;