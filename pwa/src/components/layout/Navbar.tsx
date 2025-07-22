import React from 'react';
import { Menu, Moon, Sun, Upload, User, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import SyncIndicator from '../ui/SyncIndicator';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get title based on current route
  const getTitle = () => {
    switch (true) {
      case location.pathname === '/dashboard':
        return 'Dashboard';
      case location.pathname.includes('/routes/'):
        return 'Route Details';
      case location.pathname === '/upload':
        return 'Upload Route';
      case location.pathname === '/settings':
        return 'Settings';
      default:
        return 'TracSync';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-text-light hover:bg-background transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 2L15.5 9H8.5L12 2Z" 
                  fill="currentColor" 
                />
                <path 
                  d="M18.5 9L22 16H15L18.5 9Z" 
                  fill="currentColor" 
                />
                <path 
                  d="M5.5 9L9 16H2L5.5 9Z" 
                  fill="currentColor" 
                />
                <path 
                  d="M12 16L15.5 23H8.5L12 16Z" 
                  fill="currentColor" 
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              TracSync
            </h1>
          </Link>
        </div>

        <div className="text-lg font-semibold md:hidden">
          {getTitle()}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SyncIndicator />
          </div>
          
          <Link 
            to="/upload" 
            className="btn btn-primary hidden sm:flex items-center gap-2"
          >
            <Upload size={18} />
            <span>Upload</span>
          </Link>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-light hover:bg-background transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Menu */}
          {user && (
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-lg text-text-light hover:bg-background transition-colors">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null; // Prevents infinite loop if fallback fails
                      e.target.src = '/default-avatar.png'; // Path to your fallback image
                    }}
                  />
                ) : (
                  <User size={20} />
                )}
                {/* Hide name on mobile */}
                <span className="hidden sm:block ml-2 text-sm font-medium">
                  {user.displayName || 'User'}
                </span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-sm">{user.displayName}</p>
                  <p className="text-xs text-text-light">{user.email}</p>
                  {userProfile && (
                    <p className="text-xs text-accent capitalize">{userProfile.plan} Plan</p>
                  )}
                </div>
                <div className="py-1">
                  <Link 
                    to="/settings" 
                    className="block px-3 py-2 text-sm hover:bg-background transition-colors"
                  >
                    Settings
                  </Link>
                  {/* <Link 
                    to="/pricing" 
                    className="block px-3 py-2 text-sm hover:bg-background transition-colors"
                  >
                    Upgrade Plan
                  </Link> */}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-background transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;