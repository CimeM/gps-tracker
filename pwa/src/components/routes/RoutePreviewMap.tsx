import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Route } from '../../utils/gpxParser';

interface RoutePreviewMapProps {
  route: Route;
  interactive?: boolean;
}

const RoutePreviewMap: React.FC<RoutePreviewMapProps> = ({ route, interactive = false }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      attributionControl: interactive,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
      touchZoom: interactive
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: interactive ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' : '',
      maxZoom: interactive ? 19 : 17
    }).addTo(map);

    // Create polylines for each segment
    route.segments.forEach(segment => {
      const points = segment.points.map(point => [point.position.lat, point.position.lon] as [number, number]);
      
      L.polyline(points, {
        color: '#0F7BFF',
        weight: interactive ? 4 : 3,
        opacity: 0.8
      }).addTo(map);
    });

    // Set map bounds
    const bounds = L.latLngBounds(
      [route.bounds.minLat, route.bounds.minLon],
      [route.bounds.maxLat, route.bounds.maxLon]
    );
    map.fitBounds(bounds, { padding: [10, 10] });

    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [route, interactive]);

  // Force map to update its size when container size changes
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ backgroundColor: '#f2f4f8' }}
    />
  );
};

export default RoutePreviewMap;