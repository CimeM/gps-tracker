import React from 'react';
import { Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { useSync } from '../../context/SyncContext';

const SyncIndicator: React.FC = () => {
  const { syncStatus, isOnline, isSyncing, lastSyncError, performSync } = useSync();

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

  const getSyncIcon = () => {
    if (!isOnline) return <WifiOff size={16} className="text-red-500" />;
    if (isSyncing) return <RefreshCw size={16} className="text-primary animate-spin" />;
    if (lastSyncError) return <AlertCircle size={16} className="text-red-500" />;
    if (syncStatus.pending > 0) return <Cloud size={16} className="text-yellow-500" />;
    return <CheckCircle size={16} className="text-green-500" />;
  };

  const getSyncText = () => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Syncing...';
    if (lastSyncError) return 'Sync failed';
    if (syncStatus.pending > 0) return `${syncStatus.pending} pending`;
    return 'Synced';
  };

  const getStatusColor = () => {
    if (!isOnline || lastSyncError) return 'text-red-500';
    if (isSyncing || syncStatus.pending > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={performSync}
        disabled={!isOnline || isSyncing}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={lastSyncError || `Last sync: ${formatLastSync(syncStatus.lastSync)}`}
      >
        {getSyncIcon()}
        <span className={getStatusColor()}>{getSyncText()}</span>
      </button>
      
      {syncStatus.lastSync.getTime() > 0 && (
        <span className="text-text-light text-xs">
          {formatLastSync(syncStatus.lastSync)}
        </span>
      )}
    </div>
  );
};

export default SyncIndicator;