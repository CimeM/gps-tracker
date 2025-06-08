import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, SyncStatus } from '../services/apiService';

interface SyncContextType {
  syncStatus: SyncStatus;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncError: string | null;
  performSync: () => Promise<void>;
  markForSync: (type: 'route' | 'tracker', id: string) => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: new Date(0),
    pending: 0,
    failed: 0
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load sync status on mount
  useEffect(() => {
    loadSyncStatus();
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && syncStatus.pending > 0) {
      performSync();
    }
  }, [isOnline]);

  const loadSyncStatus = async () => {
    try {
      const status = await apiService.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  const performSync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    setLastSyncError(null);

    try {
      const success = await apiService.performFullSync();
      
      if (success) {
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date(),
          pending: 0,
          failed: 0
        }));
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      setLastSyncError(errorMessage);
      setSyncStatus(prev => ({
        ...prev,
        failed: prev.failed + 1
      }));
    } finally {
      setIsSyncing(false);
    }
  };

  const markForSync = (type: 'route' | 'tracker', id: string) => {
    // Add item to pending sync queue
    const pendingItems = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    const newItem = { type, id, timestamp: Date.now() };
    
    if (!pendingItems.find((item: any) => item.type === type && item.id === id)) {
      pendingItems.push(newItem);
      localStorage.setItem('pendingSync', JSON.stringify(pendingItems));
      
      setSyncStatus(prev => ({
        ...prev,
        pending: prev.pending + 1
      }));
    }

    // Auto-sync if online
    if (isOnline) {
      setTimeout(performSync, 1000);
    }
  };

  return (
    <SyncContext.Provider value={{
      syncStatus,
      isOnline,
      isSyncing,
      lastSyncError,
      performSync,
      markForSync
    }}>
      {children}
    </SyncContext.Provider>
  );
};