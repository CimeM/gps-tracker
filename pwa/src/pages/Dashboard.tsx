import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, ArrowUpRight, Filter, FolderPlus, Folder, Grid3X3, List } from 'lucide-react';
import { useRoutes } from '../context/RouteContext';
import { formatDistance, formatDuration, formatDate } from '../utils/gpxParser';
import RouteCard from '../components/routes/RouteCard';
import EmptyState from '../components/ui/EmptyState';



const Dashboard: React.FC = () => {
  const { routes, groups, setGroups } = useRoutes();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'distance' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#0F7BFF');

  // Save groups to localStorage when they change
  React.useEffect(() => {
    localStorage.setItem('routeGroups', JSON.stringify(groups));
  }, [groups]);

  const filteredRoutes = useMemo(() => {
    let result = routes;
    
    // Apply group filter
    if (selectedGroup !== 'all') {
      const group = groups.find(g => g.id === selectedGroup);
      if (group) {
        result = result.filter(route => group.routeIds.includes(route.id));
      }
    }
    
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
  }, [routes, searchQuery, sortBy, sortOrder, selectedGroup, groups]);
  
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

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: RouteGroup = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        color: newGroupColor,
        routeIds: []
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setNewGroupColor('#0F7BFF');
      setShowCreateGroup(false);
    }
  };

  const groupColors = [
    '#0F7BFF', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', 
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
  ];
  
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

      {/* Groups */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Route Groups</h2>
          <button 
            onClick={() => setShowCreateGroup(true)}
            className="btn btn-outline text-sm"
          >
            <FolderPlus size={16} className="mr-2" />
            New Group
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedGroup === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-background text-text-light hover:text-text'
            }`}
          >
            All Routes ({routes.length})
          </button>
          
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedGroup === group.id 
                  ? 'text-white' 
                  : 'bg-background text-text-light hover:text-text'
              }`}
              style={{ 
                backgroundColor: selectedGroup === group.id ? group.color : undefined 
              }}
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: group.color }}
              />
              {group.name} ({group.routeIds.length})
            </button>
          ))}
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
          <div className="flex border border-border rounded-lg">
            <button 
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-background'
              }`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={16} />
            </button>
            <button 
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-background'
              }`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
          
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
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map(route => (
            <Link to={`/routes/${route.id}`} key={route.id}>
              <RouteCard route={route} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRoutes.map(route => (
            <Link to={`/routes/${route.id}`} key={route.id}>
              <div className="card p-4 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {route.name}
                    </h3>
                    <p className="text-text-light text-sm mb-2">
                      {formatDate(new Date(route.date))}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{formatDistance(route.totalDistance)}</span>
                      <span>{formatDuration(route.totalDuration)}</span>
                      <span>{route.totalElevationGain.toFixed(0)}m elevation</span>
                    </div>
                  </div>
                  <ArrowUpRight size={20} className="text-text-light group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredRoutes.length === 0 && (
        <div className="text-center py-12">
          <Folder size={48} className="mx-auto text-text-light mb-4" />
          <h3 className="text-lg font-semibold mb-2">No routes found</h3>
          <p className="text-text-light">
            {selectedGroup === 'all' 
              ? 'Try adjusting your search terms'
              : 'This group is empty. Add some routes to get started.'
            }
          </p>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card max-w-md w-full p-6 fade-in slide-up">
            <h3 className="text-xl font-bold mb-4">Create New Group</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Mountain Hikes"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {groupColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewGroupColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newGroupColor === color ? 'border-text scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button 
                className="btn text-text-light hover:bg-background"
                onClick={() => setShowCreateGroup(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim()}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;