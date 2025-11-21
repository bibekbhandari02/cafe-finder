import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ cafes, selectedCafe }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true
      }).setView([27.6667, 85.3167], 7);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 3
      }).addTo(mapInstance.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Custom cafe icon
    const cafeIcon = L.divIcon({
      className: 'custom-cafe-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">☕</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // Add markers for each cafe
    cafes.forEach(cafe => {
      // Validate coordinates before creating marker
      const lat = cafe.address?.coordinates?.lat;
      const lng = cafe.address?.coordinates?.lng;
      
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        console.warn(`Skipping cafe "${cafe.name}" - invalid coordinates:`, lat, lng);
        return; // Skip this cafe
      }

      const marker = L.marker([lat, lng], { 
        icon: cafeIcon,
        riseOnHover: true 
      })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-lg mb-2">${cafe.name}</h3>
            <p class="text-sm text-gray-600 mb-2">📍 ${cafe.address.city}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-yellow-100 px-2 py-1 rounded-lg text-sm">
                ⭐ ${cafe.avgRating.toFixed(1)}
              </span>
              <span class="text-xs text-gray-500">(${cafe.reviewCount})</span>
            </div>
            <p class="text-sm font-bold text-amber-600">${cafe.priceRange}</p>
          </div>
        `, {
          maxWidth: 250,
          className: 'custom-popup'
        });
      
      // Smooth zoom on click - no animation to avoid errors
      marker.on('click', () => {
        mapInstance.current.setView([lat, lng], 14);
      });

      // Open popup on hover
      marker.on('mouseover', function() {
        this.openPopup();
      });
      
      if (selectedCafe?._id === cafe._id) {
        marker.openPopup();
      }

      markersRef.current.push(marker);
    });

    // Focus on selected cafe - use setView instead of flyTo to avoid animation errors
    if (selectedCafe && mapInstance.current) {
      const lat = selectedCafe.address?.coordinates?.lat;
      const lng = selectedCafe.address?.coordinates?.lng;
      
      // Only move map if we have valid coordinates
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        mapInstance.current.setView([lat, lng], 14);
      }
    }
  }, [cafes, selectedCafe]);

  return <div ref={mapRef} className="h-96 w-full rounded-xl shadow-lg" />;
};

export default MapView;