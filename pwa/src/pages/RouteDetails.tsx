import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Mountain, 
  Timer,
  Trash2,
  Share2,
  Download
} from 'lucide-react';
import { useRoutes } from '../context/RouteContext';
import { formatDistance, formatDuration, formatElevation, formatSpeed, formatDate } from '../utils/gpxParser';
import RouteMap from '../components/routes/RouteMap';
import RouteElevationChart from '../components/routes/RouteElevationChart';
import RouteMetricsChart from '../components/routes/RouteMetricsChart';

const RouteDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoute, deleteRoute } = useRoutes();
  const [route, setRoute] = useState(id ? getRoute(id) : undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    if (id) {
      const routeData = getRoute(id);
      if (routeData) {
        setRoute(routeData);
      } else {
        navigate('/');
      }
    }
  }, [id, getRoute, navigate]);

  if (!route) {
    return <div className="p-6">Loading route...</div>;
  }
  
  const handleDelete = () => {
    if (id) {
      deleteRoute(id);
      navigate('/');
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: route.name,
          text: `Check out my route: ${route.name}`,
          // In a real app, you would generate a shareable URL
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fade-in pb-16 md:pb-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-background"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">{route.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="btn btn-outline"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="btn text-text-light hover:text-white hover:bg-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {/* Route metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Calendar className="text-primary" size={20} />
          </div>
          <div>
            <p className="text-text-light text-sm">Date</p>
            <p className="font-semibold">{formatDate(new Date(route.date))}</p>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
            <svg className="text-accent" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 9H11L3 22H21L13 9H20L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-text-light text-sm">Distance</p>
            <p className="font-semibold">{formatDistance(route.totalDistance)}</p>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Timer className="text-purple-500" size={20} />
          </div>
          <div>
            <p className="text-text-light text-sm">Duration</p>
            <p className="font-semibold">{formatDuration(route.totalDuration)}</p>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
            <Mountain className="text-orange-500" size={20} />
          </div>
          <div>
            <p className="text-text-light text-sm">Elevation</p>
            <p className="font-semibold">{formatElevation(route.totalElevationGain)}</p>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="card mb-6 overflow-hidden">
        <div className="h-72 sm:h-96 w-full">
          <RouteMap route={route} />
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-4">
          <h3 className="font-bold mb-3">Elevation Profile</h3>
          <div className="h-48 md:h-64">
            <RouteElevationChart route={route} />
          </div>
        </div>
        
        <div className="card p-4">
          <h3 className="font-bold mb-3">Speed & Heart Rate</h3>
          <div className="h-48 md:h-64">
            <RouteMetricsChart route={route} />
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
          <div className="card max-w-md w-full p-6 fade-in slide-up">
            <h3 className="text-xl font-bold mb-3">Delete Route?</h3>
            <p className="text-text-light mb-6">
              Are you sure you want to delete <span className="font-medium">{route.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                className="btn text-text-light hover:bg-background"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn bg-red-500 text-white hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteDetails;