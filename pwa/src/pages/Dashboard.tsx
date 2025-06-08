import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, ArrowUpRight, Filter } from 'lucide-react';
import { useRoutes } from '../context/RouteContext';
import { formatDistance, formatDuration, formatDate } from '../utils/gpxParser';
import RouteCard from '../components/routes/RouteCard';
import EmptyState from '../components/ui/EmptyState';

const Dashboard: React.FC = () => {
  const { routes } = useRoutes();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'distance' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const filteredRoutes = useMemo(() => {
    let result = routes;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(route => 
        route.name.toLowerCase().includes(query) || 
        route.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    return [...result].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'distance':
          comparison = a.totalDistance - b.totalDistance;
          break;
        case 'duration':
          comparison = a.totalDuration - b.totalDuration;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [routes, searchQuery, sortBy, sortOrder]);
  
  // Calculate total stats
  const totalStats = useMemo(() => {
    return routes.reduce((stats, route) => {
      stats.distance += route.totalDistance;
      stats.duration += route.totalDuration;
      stats.elevationGain += route.totalElevationGain;
      return stats;
    }, { distance: 0, duration: 0, elevationGain: 0 });
  }, [routes]);
  
  // Toggle sort order
  const toggleSort = (field: 'date' | 'distance' | 'duration') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  if (routes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Your Routes</h1>
        <p className="text-text-light">View and manage your GPS route activities</p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-text-light text-sm mb-1">Total Distance</p>
          <p className="text-2xl font-bold">{formatDistance(totalStats.distance)}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-light text-sm mb-1">Total Duration</p>
          <p className="text-2xl font-bold">{formatDuration(totalStats.duration)}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-light text-sm mb-1">Total Elevation Gain</p>
          <p className="text-2xl font-bold">{totalStats.elevationGain.toFixed(0)}m</p>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" size={18} />
          <input
            type="text"
            placeholder="Search routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button 
            className={`btn ${sortBy === 'date' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => toggleSort('date')}
          >
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </span>
          </button>
          <button 
            className={`btn ${sortBy === 'distance' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => toggleSort('distance')}
          >
            <span className="flex items-center gap-1">
              <Filter size={16} />
              Distance {sortBy === 'distance' && (sortOrder === 'asc' ? '↑' : '↓')}
            </span>
          </button>
        </div>
      </div>
      
      {/* Route list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map(route => (
          <Link to={`/routes/${route.id}`} key={route.id}>
            <RouteCard route={route} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;