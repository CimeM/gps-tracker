import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Settings
} from 'lucide-react';

const Footer: React.FC = () => {
  const navItems = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      title: 'Upload', 
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
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border md:hidden z-10">
      <div className="grid grid-cols-3 h-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center transition-colors
              ${isActive 
                ? 'text-primary' 
                : 'text-text-light hover:text-text'
              }
            `}
            end={item.path === '/'} // Only exact match for home
          >
            {item.icon}
            <span className="text-xs mt-1">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </footer>
  );
};

export default Footer;