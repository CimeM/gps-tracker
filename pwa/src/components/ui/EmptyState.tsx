import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Upload } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <MapPin size={32} className="text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold mb-3">No routes yet</h2>
        
        <p className="text-text-light mb-8">
          Upload your first GPX file to start tracking and visualizing your routes
        </p>
        
        <Link 
          to="/upload" 
          className="btn btn-primary flex items-center justify-center gap-2 w-full max-w-xs mx-auto"
        >
          <Upload size={18} />
          <span>Upload GPX File</span>
        </Link>
        
        <div className="mt-8 p-4 bg-background rounded-lg">
          <h3 className="font-semibold mb-2">What is a GPX file?</h3>
          <p className="text-text-light text-sm">
            GPX (GPS Exchange Format) files contain GPS data such as waypoints, tracks, and routes. 
            These are commonly exported from fitness apps, GPS devices, and mapping software.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;