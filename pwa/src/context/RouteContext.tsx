import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Route, parseGpxFile } from '../utils/gpxParser';
import { useSync } from './SyncContext';
import { useAuth } from './AuthContext';
import { apiService as firebaseService } from '../services/apiService';


interface RouteGroup {
  id: string;
  name: string;
  color: string;
  routeIds: string[];
}

interface RouteContextType {
  routes: Route[];
  groups: RouteGroup[]
  setGroups: Dispatch<SetStateAction<RouteGroup[]>>;
  addRoute: (file: File) => Promise<boolean>;
  getRoute: (id: string) => Route | undefined;
  deleteRoute: (id: string) => void;
  loading: boolean;
  syncWithFirebase: () => Promise<void>;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const useRoutes = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoutes must be used within a RouteProvider');
  }
  return context;
};

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const { markForSync } = useSync();
  const { user, userProfile } = useAuth();

  // Load groups from localStorage
  const [groups, setGroups] = useState<RouteGroup[]>(() => {
    const saved = localStorage.getItem('routeGroups');
    return saved ? JSON.parse(saved) : [
      // { id: 'recent', name: 'Recent Routes', color: '#0F7BFF', routeIds: [] },
      { id: 'favorites', name: 'Favorites', color: '#F59E0B', routeIds: [] }
    ];
  });

  // Load routes from localStorage on mount (fallback for offline)
  useEffect(() => {
    const savedRoutes = localStorage.getItem('gpxRoutes');
    if (savedRoutes) {
      try {
        setRoutes(JSON.parse(savedRoutes));
      } catch (error) {
        console.error('Error parsing saved routes:', error);
      }
    }
  }, []);

  // Load routes from Firebase when user is authenticated
  useEffect(() => {
    if (user) {
      loadFirebaseRoutes();
    }
  }, [user]);

  // Save routes to localStorage when they change (offline backup)
  useEffect(() => {
    if (routes.length > 0) {
      localStorage.setItem('gpxRoutes', JSON.stringify(routes));
    }
  }, [routes]);

  
  // const setGroups = async (file: File): Promise<boolean> => {
  //   try {
  //     setLoading(true);
  // }
  const loadFirebaseRoutes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const firebaseRoutes = await firebaseService.getUserRoutes(user.uid);
      console.log("firebaseRoutes", firebaseRoutes);
      // Convert Firebase routes back to local Route format
      const localRoutes: Route[] = firebaseRoutes.map(fbRoute => ({
        ...fbRoute,
        date: fbRoute.uploadedAt.toDate()
      }));
      
      setRoutes(localRoutes);
    } catch (error) {
      console.error('Error loading Firebase routes:', error);
      // Fall back to localStorage if Firebase fails
    } finally {
      setLoading(false);
    }
  };

  const addRoute = async (file: File): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Check storage limits for authenticated users
      if (user && userProfile) {
        const currentUsage = userProfile.storageUsed;
        const fileSize = file.size;
        
        if (currentUsage + fileSize > userProfile.storageLimit) {
          alert('Storage limit exceeded. Please upgrade your plan or delete some routes.');
          return false;
        }
      }

      const route = await parseGpxFile(file);
      console.log("parsed route: ");
      console.log(route);
      // Add to local state immediately for better UX
      setRoutes(prevRoutes => [...prevRoutes, route]);
      
      // If user is authenticated, upload to Firebase
      if (user) {
        try {
          await firebaseService.uploadRoute(user.uid, route, file);
        } catch (error) {
          console.error('Error uploading to Firebase:', error);
          // Mark for sync later if upload fails
          markForSync('route', route.id);
        }
      } else {
        // For non-authenticated users, just mark for sync
        markForSync('route', route.id);
      }
      
      return true;
    } catch (error) {
      console.error('Error parsing GPX file:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getRoute = (id: string): Route | undefined => {
    return routes.find(route => route.id === id);
  };

  const deleteRoute = async (id: string) => {
    // Remove from local state immediately
    setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== id));
    
    // If user is authenticated, delete from Firebase
    if (user) {
      try {
        await firebaseService.deleteRoute(id, user.uid);
      } catch (error) {
        console.error('Error deleting from Firebase:', error);
        // Could implement a retry mechanism here
      }
    }
  };

  const syncWithFirebase = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await loadFirebaseRoutes();
    } catch (error) {
      console.error('Error syncing with Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteContext.Provider value={{ 
      routes, 
      groups,
      setGroups,
      addRoute, 
      getRoute, 
      deleteRoute, 
      loading,
      syncWithFirebase
    }}>
      {children}
    </RouteContext.Provider>
  );
};