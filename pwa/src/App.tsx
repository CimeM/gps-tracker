import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import RouteDetails from './pages/RouteDetails';
import UploadRoute from './pages/UploadRoute';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import { RouteProvider } from './context/RouteContext';
import { ThemeProvider } from './context/ThemeContext';
import { SyncProvider } from './context/SyncContext';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/layout/Footer';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're on pages that don't need the main app layout
  const isPublicPage = ['/', '/pricing'].includes(location.pathname);
  
  useEffect(() => {
    // Close sidebar when changing routes on mobile
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <ThemeProvider> 
      <AuthProvider>
        {isPublicPage ? (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        ) : (
          <SyncProvider>
            <RouteProvider>
              <div className="flex h-screen overflow-hidden">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                
                <div className="flex flex-col flex-1 h-screen overflow-y-auto">
                  <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                  
                  <main className="flex-1 p-4 md:p-6 pb-24 bg-background transition-colors duration-300">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/routes/:id" element={<RouteDetails />} />
                      <Route path="/upload" element={<UploadRoute />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </main>
                  
                  <Footer />
                </div>
              </div>
            </RouteProvider>
          </SyncProvider>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;