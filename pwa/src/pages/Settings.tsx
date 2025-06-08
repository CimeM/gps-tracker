import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useRoutes } from '../context/RouteContext';
import { useSync } from '../context/SyncContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Trash2, 
  Database, 
  Info,
  MapPin,
  Map,
  Plus,
  Signal,
  Settings as SettingsIcon,
  Trash,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Tracker {
  id: string;
  code: string;
  label: string;
  lastSync: Date;
  settings: {
    updateInterval: number;
    powerSaveMode: boolean;
    geofenceRadius: number;
  };
}

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { routes } = useRoutes();
  const { syncStatus, isOnline, isSyncing, performSync, markForSync } = useSync();
  const navigate = useNavigate();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showAddTrackerModal, setShowAddTrackerModal] = useState(false);
  const [newTrackerCode, setNewTrackerCode] = useState('');
  const [newTrackerLabel, setNewTrackerLabel] = useState('');
  const [trackers, setTrackers] = useState<Tracker[]>(() => {
    const saved = localStorage.getItem('trackers');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingTracker, setEditingTracker] = useState<Tracker | null>(null);
  
  // Save trackers to localStorage when they change
  React.useEffect(() => {
    localStorage.setItem('trackers', JSON.stringify(trackers));
  }, [trackers]);

  const handleAddTracker = () => {
    if (newTrackerCode.length !== 4 || !/^\d+$/.test(newTrackerCode)) {
      alert('Please enter a valid 4-digit code');
      return;
    }

    const newTracker: Tracker = {
      id: Date.now().toString(),
      code: newTrackerCode,
      label: newTrackerLabel || `Tracker ${newTrackerCode}`,
      lastSync: new Date(),
      settings: {
        updateInterval: 60,
        powerSaveMode: false,
        geofenceRadius: 100
      }
    };

    setTrackers([...trackers, newTracker]);
    setNewTrackerCode('');
    setNewTrackerLabel('');
    setShowAddTrackerModal(false);
    
    // Mark for sync
    markForSync('tracker', newTracker.id);
  };

  const handleUpdateTrackerSettings = (trackerId: string, settings: Partial<Tracker['settings']>) => {
    setTrackers(trackers.map(tracker => 
      tracker.id === trackerId 
        ? { ...tracker, settings: { ...tracker.settings, ...settings } }
        : tracker
    ));
    
    // Mark for sync
    markForSync('tracker', trackerId);
  };

  const handleDeleteTracker = (trackerId: string) => {
    if (confirm('Are you sure you want to delete this tracker?')) {
      setTrackers(trackers.filter(t => t.id !== trackerId));
    }
  };

  // Calculate localStorage usage
  const getStorageUsage = (): string => {
    try {
      const gpxRoutes = localStorage.getItem('gpxRoutes');
      if (!gpxRoutes) return '0 KB';
      
      const bytes = new Blob([gpxRoutes]).size;
      if (bytes < 1024) {
        return `${bytes} B`;
      } else if (bytes < 1048576) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      } else {
        return `${(bytes / 1048576).toFixed(1)} MB`;
      }
    } catch (error) {
      return 'Unknown';
    }
  };
  
  // Clear all routes from localStorage
  const handleClearAll = () => {
    localStorage.removeItem('gpxRoutes');
    localStorage.removeItem('trackers');
    localStorage.removeItem('pendingSync');
    window.location.href = '/dashboard';
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-text-light">Customize your GPS Route Tracker experience</p>
      </div>
      
      {/* Sync Status */}
      <div className="card mb-6">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Sync Status</h2>
          <p className="text-text-light text-sm">Data synchronization with cloud services</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Wifi size={20} className="text-green-500" />
              ) : (
                <WifiOff size={20} className="text-red-500" />
              )}
              <div>
                <p className="font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </p>
                <p className="text-sm text-text-light">
                  Last sync: {formatLastSync(syncStatus.lastSync)}
                </p>
              </div>
            </div>
            
            <button 
              onClick={performSync}
              disabled={!isOnline || isSyncing}
              className="btn btn-outline disabled:opacity-50"
            >
              <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
          
          {syncStatus.pending > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {syncStatus.pending} items pending sync
              </p>
            </div>
          )}
          
          {syncStatus.failed > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200">
                {syncStatus.failed} items failed to sync
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Trackers Section */}
      <div className="card mb-6">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">GPS Trackers</h2>
              <p className="text-text-light text-sm">Manage your connected tracking devices</p>
            </div>
            <button 
              onClick={() => setShowAddTrackerModal(true)}
              className="btn btn-primary"
            >
              <Plus size={18} className="mr-2" />
              Add Tracker
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {trackers.map(tracker => (
            <div key={tracker.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Signal size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{tracker.label}</h3>
                    <p className="text-sm text-text-light">Code: {tracker.code}</p>
                    <p className="text-xs text-text-light">
                      Last sync: {new Date(tracker.lastSync).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTracker(tracker.id)}
                  className="p-2 text-text-light hover:text-red-500 transition-colors"
                  aria-label="Delete tracker"
                >
                  <Trash size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Update Interval (seconds)
                  </label>
                  <input
                    type="number"
                    value={tracker.settings.updateInterval}
                    onChange={(e) => handleUpdateTrackerSettings(tracker.id, {
                      updateInterval: parseInt(e.target.value)
                    })}
                    className="input-field"
                    min="30"
                    max="3600"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Geofence Radius (meters)
                  </label>
                  <input
                    type="number"
                    value={tracker.settings.geofenceRadius}
                    onChange={(e) => handleUpdateTrackerSettings(tracker.id, {
                      geofenceRadius: parseInt(e.target.value)
                    })}
                    className="input-field"
                    min="50"
                    max="1000"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Power Save Mode</label>
                    <p className="text-xs text-text-light">
                      Extends battery life by reducing update frequency
                    </p>
                  </div>
                  <button
                    onClick={() => handleUpdateTrackerSettings(tracker.id, {
                      powerSaveMode: !tracker.settings.powerSaveMode
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      tracker.settings.powerSaveMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        tracker.settings.powerSaveMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {trackers.length === 0 && (
            <div className="p-6 text-center text-text-light">
              <MapPin size={24} className="mx-auto mb-2" />
              <p>No trackers added yet</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Theme Settings */}
      <div className="card mb-6">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="text-text-light text-sm">Customize the app appearance</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon size={20} className="text-text-light" />
              ) : (
                <Sun size={20} className="text-text-light" />
              )}
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-text-light">
                  Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="btn btn-outline"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Data Settings */}
      <div className="card mb-6">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Data Management</h2>
          <p className="text-text-light text-sm">Manage your route data</p>
        </div>
        
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-text-light" />
              <div>
                <p className="font-medium">Storage Usage</p>
                <p className="text-sm text-text-light">
                  {getStorageUsage()} • {routes.length} routes • {trackers.length} trackers
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-500" />
              <div>
                <p className="font-medium">Clear All Data</p>
                <p className="text-sm text-text-light">
                  Delete all saved routes, trackers, and reset app
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowClearModal(true)}
              className="btn bg-red-500 text-white hover:bg-red-600"
              disabled={routes.length === 0 && trackers.length === 0}
              aria-label="Clear all data"
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>
      
      {/* About */}
      <div className="card mb-6">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="text-text-light text-sm">Application information</p>
        </div>
        
        <div className="p-6 flex items-start gap-4">
          <div className="bg-primary text-white p-2.5 rounded-lg mt-1">
            <Map size={24} />
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-1">GPS Route Tracker</h3>
            <p className="text-text-light mb-4">
              A Progressive Web App for visualizing and analyzing your GPS routes
              from GPX files with cloud synchronization.
            </p>
            
            <div className="text-sm text-text-light">
              <p>Version 0.1.0</p>
              <p>Created with React, TypeScript, and Vite</p>
              <p>Maps powered by Leaflet and OpenStreetMap</p>
              <p>Cloud sync with REST API integration</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Tracker Modal */}
      {showAddTrackerModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
          <div className="card max-w-md w-full p-6 fade-in slide-up">
            <h3 className="text-xl font-bold mb-4">Add New Tracker</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tracker Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={newTrackerCode}
                  onChange={(e) => setNewTrackerCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit code"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Label (Optional)
                </label>
                <input
                  type="text"
                  value={newTrackerLabel}
                  onChange={(e) => setNewTrackerLabel(e.target.value)}
                  placeholder="e.g., Car Tracker"
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button 
                className="btn text-text-light hover:bg-background"
                onClick={() => setShowAddTrackerModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddTracker}
              >
                Add Tracker
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Clear data confirmation modal */}
      {showClearModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
          <div className="card max-w-md w-full p-6 fade-in slide-up">
            <div className="text-red-500 mb-4">
              <AlertIcon size={32} />
            </div>
            
            <h3 className="text-xl font-bold mb-2">Clear All Data?</h3>
            
            <p className="text-text-light mb-6">
              This will permanently delete all your routes, trackers, and reset the app.
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                className="btn text-text-light hover:bg-background"
                onClick={() => setShowClearModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn bg-red-500 text-white hover:bg-red-600"
                onClick={handleClearAll}
              >
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Alert Icon Component
const AlertIcon: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
      <Trash2 size={size * 0.5} className="text-red-500" />
    </div>
  );
};

export default Settings;