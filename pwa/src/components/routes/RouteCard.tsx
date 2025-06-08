import React from 'react';
import { Route, formatDistance, formatDuration, formatDate } from '../../utils/gpxParser';
import RoutePreviewMap from './RoutePreviewMap';
import { Timer, Mountain, Calendar } from 'lucide-react';

interface RouteCardProps {
  route: Route;
}

const RouteCard: React.FC<RouteCardProps> = ({ route }) => {
  return (
    <div className="card overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Map preview */}
      <div className="h-36 w-full relative">
        <RoutePreviewMap route={route} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Route date */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <Calendar size={14} />
          <span className="text-sm font-medium">{formatDate(new Date(route.date))}</span>
        </div>
      </div>
      
      {/* Route info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
          {route.name}
        </h3>
        
        <p className="text-text-light text-sm mb-3 line-clamp-2 h-10">
          {route.description || 'No description provided'}
        </p>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center text-center p-1">
            <div className="flex items-center gap-1 text-text-light mb-1">
              <Mountain size={14} />
            </div>
            <span className="font-semibold text-sm">
              {route.totalElevationGain.toFixed(0)}m
            </span>
            <span className="text-xs text-text-light">Elevation</span>
          </div>
          
          <div className="flex flex-col items-center text-center p-1 border-x border-border">
            <div className="flex items-center gap-1 text-text-light mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 9H11L3 22H21L13 9H20L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-sm">{formatDistance(route.totalDistance)}</span>
            <span className="text-xs text-text-light">Distance</span>
          </div>
          
          <div className="flex flex-col items-center text-center p-1">
            <div className="flex items-center gap-1 text-text-light mb-1">
              <Timer size={14} />
            </div>
            <span className="font-semibold text-sm">
              {formatDuration(route.totalDuration).split(' ')[0]}
            </span>
            <span className="text-xs text-text-light">Duration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;