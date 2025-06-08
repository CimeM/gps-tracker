import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Upload, 
  Settings, 
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { 
      title: 'Dashboard', 
      path: '/', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      title: 'Upload Route', 
      path: '/upload', 
      icon: <Upload size={20} /> 
    },
    { 
      title: 'Settings', 
      path: '/settings', 
      icon: <Settings size={20} /> 
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:relative lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <Map size={20} />
            </div>
            <h2 className="text-xl font-bold">Route Tracker</h2>
          </div>
          
          <button
            className="p-1.5 rounded-lg hover:bg-background lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-text-light hover:bg-background hover:text-text'
                    }
                  `}
                  end={item.path === '/'} // Only exact match for home
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="text-sm text-text-light">
            <p>GPS Route Tracker v0.1.0</p>
            <p className="mt-1">Local storage: {calculateStorageUsage()}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

// Calculate approximate localStorage usage
const calculateStorageUsage = (): string => {
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

export default Sidebar;