import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Route } from '../../utils/gpxParser';

interface RouteMapProps {
  route: Route;
  showMarkers?: boolean;
}

const RouteMap: React.FC<RouteMapProps> = ({ route, showMarkers = true }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Create a polyline for each segment
    route.segments.forEach(segment => {
      const points = segment.points.map(point => [point.position.lat, point.position.lon] as [number, number]);
      
      // Create gradient polyline based on elevation
      const elevations = segment.points.map(point => point.position.ele);
      const minEle = Math.min(...elevations);
      const maxEle = Math.max(...elevations);
      const eleRange = maxEle - minEle;
      
      for (let i = 1; i < points.length; i++) {
        const startEle = segment.points[i-1].position.ele;
        const endEle = segment.points[i].position.ele;
        const avgEle = (startEle + endEle) / 2;
        
        // Normalize elevation to get color (blue-green-yellow-red gradient)
        let colorValue = eleRange ? (avgEle - minEle) / eleRange : 0;
        colorValue = Math.max(0, Math.min(1, colorValue)); // Clamp between 0 and 1
        
        // Create color based on elevation (blue = low, red = high)
        const r = Math.round(colorValue * 255);
        const g = Math.round(Math.abs(colorValue - 0.5) * 255);
        const b = Math.round((1 - colorValue) * 255);
        
        L.polyline([points[i-1], points[i]], {
          color: `rgb(${r}, ${g}, ${b})`,
          weight: 4,
          opacity: 0.8
        }).addTo(map);
      }
    });

    // Add start/end markers if requested
    if (showMarkers) {
      // Start marker
      const startIcon = L.divIcon({
        html: `<div class="bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>`,
        className: 'custom-div-icon',
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });
      
      // End marker
      const endIcon = L.divIcon({
        html: `<div class="bg-red-500 w-4 h-4 rounded-full border-2 border-white"></div>`,
        className: 'custom-div-icon',
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });
      
      L.marker([route.startPoint.lat, route.startPoint.lon], { icon: startIcon })
        .addTo(map)
        .bindTooltip('Start', { permanent: false, direction: 'right' });
      
      L.marker([route.endPoint.lat, route.endPoint.lon], { icon: endIcon })
        .addTo(map)
        .bindTooltip('End', { permanent: false, direction: 'right' });
    }

    // Set map bounds
    const bounds = L.latLngBounds(
      [route.bounds.minLat, route.bounds.minLon],
      [route.bounds.maxLat, route.bounds.maxLon]
    );
    map.fitBounds(bounds, { padding: [30, 30] });

    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [route, showMarkers]);

  // Force map to update its size when container size changes
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Also invalidate after a small delay to ensure proper sizing
    const timer = setTimeout(() => {
      handleResize();
    }, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ backgroundColor: '#f2f4f8' }}
    />
  );
};

export default RouteMap;