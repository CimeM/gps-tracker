import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Route, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Cloud,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Zap,
  Battery,
  Wifi,
  MapIcon,
  User,
  LogIn,
  Download,
  Share2,
  Plus,
  ExternalLink,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleSignIn = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthMode('signin');
      setShowAuthModal(true);
    }
  };

  const features = [
    {
      icon: <MapPin className="text-primary" size={24} />,
      title: 'Real-time Tracking',
      description: 'Track your GPS routes in real-time with precise location data and comprehensive analytics.'
    },
    {
      icon: <Route className="text-primary" size={24} />,
      title: 'Route Visualization',
      description: 'Visualize your routes on interactive maps with elevation profiles and detailed metrics.'
    },
    {
      icon: <BarChart3 className="text-primary" size={24} />,
      title: 'Advanced Analytics',
      description: 'Get detailed insights with charts showing speed, elevation, heart rate, and more.'
    },
    {
      icon: <Shield className="text-primary" size={24} />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely with full privacy protection.'
    },
    {
      icon: <Smartphone className="text-primary" size={24} />,
      title: 'Progressive Web App',
      description: 'Install TracSync on your device for native app experience with offline capabilities.'
    },
    {
      icon: <Cloud className="text-primary" size={24} />,
      title: 'Cloud Sync',
      description: 'Automatic synchronization across all your devices with cloud backup.'
    }
  ];

  const hardwareFeatures = [
    {
      icon: <Zap className="text-accent" size={20} />,
      title: 'Power',
      description: 'With a compact battery under 2000mAh, it easily achieves over 2 days of continuous tracking in normal mode.'
    },
    {
      icon: <Zap className="text-accent" size={20} />,
      title: 'Customizable & Developer-Focused',
      description: 'Enables you to build and modify tracking features to fit your project’s unique needs.'
    },
    {
      icon: <Wifi className="text-accent" size={20} />,
      title: 'ESP32-S3',
      description: 'ESP32-S3, a powerful microcontroller with built-in Wi-Fi and Bluetooth.'
    },
    {
      icon: <Shield className="text-accent" size={20} />,
      title: 'uBlox MAX-M10S',
      description: 'High-performance multi-GNSS receiver. Supports GPS, Galileo, GLONASS, and BeiDou.'
    },
    {
      icon: <MapIcon className="text-accent" size={20} />,
      title: 'Sensors',
      description: 'Sub-meter accuracy with multi-constellation support'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Trail Runner',
      content: 'TracSync has completely transformed how I track my running routes. The elevation charts are incredibly detailed!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Cyclist',
      content: 'Perfect for analyzing my cycling performance. The GPS accuracy is outstanding and the interface is beautiful.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Hiker',
      content: 'Love how easy it is to upload GPX files and see all my hiking adventures visualized on the map.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 sm:p-2 rounded-lg">
                <MapPin size={18} className="sm:size-10" />
              </div>
              <span className="text-lg sm:text-xl font-bold">TracSync</span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Install App Button: icon only on mobile, text on sm+ */}
              <button 
                onClick={() => setShowInstallInstructions(true)}
                className="text-text-light hover:text-text transition-colors flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2"
              >
                <Download size={18} />
                <span className=" sm:inline">Install</span>
              </button>
              {user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Dashboard link: hide on mobile, show on sm+ */}
                  <Link 
                    to="/dashboard" 
                    className="hidden sm:inline text-text-light hover:text-text transition-colors"
                  >
                    Dashboard
                  </Link>
                  {/* Go to App: icon only on mobile, text on sm+ */}
                  <Link 
                    to="/dashboard" 
                    className="btn btn-primary flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2"
                  >
                    <MapPin size={18} />
                    <span className="hidden sm:inline">Go to App</span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Sign In: icon only on mobile, text on sm+ */}
                  <button 
                    onClick={handleSignIn}
                    className="text-text-light hover:text-text transition-colors flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2"
                  >
                    {/* <LogIn size={18} />
                    <span className="hidden sm:inline">Sign In</span> */}
                  </button>
                  {/* Get Started: icon only on mobile, text on sm+ */}
                  <button 
                    onClick={handleGetStarted}
                    className="btn btn-primary flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline">Get Started</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Professional GPS Tracking
            </h1>
            <p className="text-xl text-text-light mb-8 max-w-3xl mx-auto">
              TracSync is the ultimate platform for visualizing, analyzing, and sharing your GPS routes. 
              Upload GPX files, connect hardware trackers, and gain insights into your adventures.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={handleGetStarted}
                className="btn btn-primary text-lg px-8 py-3 flex items-center gap-2"
              >
                Start Tracking
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => setShowInstallInstructions(true)}
                className="btn btn-outline text-lg px-8 py-3 flex items-center gap-2"
              >
                <Download size={20} />
                Install App
              </button>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 backdrop-blur-sm border border-border">
                <div className="bg-card rounded-xl p-6 shadow-lg" 
                    style={{ 
                      backgroundImage: `url("/demo-route.png")` 
                    }}
                    >
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-primary/20 rounded"></div>
                      <div className="h-4 bg-primary/10 rounded w-3/4"></div>
                      <div className="h-4 bg-primary/10 rounded w-1/2"></div>
                    </div>
                    <div className="bg-primary/10 rounded-lg h-32 flex items-center justify-center">
                      <MapPin size={32} className="text-primary" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-accent/20 rounded"></div>
                      <div className="h-4 bg-accent/10 rounded w-2/3"></div>
                      <div className="h-4 bg-accent/10 rounded w-3/4"></div>
                    </div>
                  </div>
                    
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Support Section */}
      <section className="py-20 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Supported Hardware
            </h2>
            <p className="text-xl text-text-light max-w-2xl mx-auto">
              Connect your GPS tracking devices for seamless data collection and real-time monitoring.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Pocket Tracker Showcase */}
            <div className="card p-8 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-accent text-white p-3 rounded-xl">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Pocket Tracker</h3>
                      <p className="text-text-light">DIY GPS Tracking Device</p>
                    </div>
                  </div>
                  
                  <p className="text-text-light mb-6">
                    PocketTracker is a compact, developer-friendly tracking device designed for custom applications, 
                    prototyping, and specialized projects but it is also for entusiast who want to build his own tracking device. 
                    PocketTracker is built for flexibility and customization, allowing developers to integrate their own firmware, sensors, and tracking 
                    solutions.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {hardwareFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg mt-1">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{feature.title}</h4>
                          <p className="text-xs text-text-light">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a 
                      href="https://www.elecrow.com/pocket-tracker.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Buy PocketTracker
                      <ExternalLink size={16} />
                    </a>
                    <button 
                      onClick={handleGetStarted}
                      className="btn btn-outline"
                    >
                      Connect to TracSync
                    </button>
                    <a 
                      href="https://www.gabrielecalabrese.com/pockettracker/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline  flex items-center" 
                    >
                      Official site
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <div className="relative">
                  {/* Pocket Tracker Image */}
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-2xl">
                    <img 
                      src="/pocketTracker.png"
                      alt="Pocket Tracker GPS Device"
                      className="w-full h-64 object-cover rounded-xl mb-4"
                    />
                    <div className="text-center">
                      <div className="text-text font-bold text-lg">
                        <a 
                          href="https://www.gabrielecalabrese.com/pockettracker/">
                          PocketTracker
                        </a>
                      </div>
                      {/* <div className="text-text-light text-sm">Source: https://www.gabrielecalabrese.com/pockettracker/</div> */}
                    </div>
                  </div>
                  
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -right-4 bg-card rounded-lg p-3 shadow-lg border border-border">
                    <div className="text-xs text-text-light">Accuracy</div>
                    <div className="text-lg font-bold text-accent">±1.5m</div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-card rounded-lg p-3 shadow-lg border border-border">
                    <div className="text-xs text-text-light">Battery Life</div>
                    <div className="text-lg font-bold text-primary">2 days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Instructions */}
            {/* <div className="card p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Wifi size={24} className="text-primary" />
                How to Connect Pocket Tracker to TracSync
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Power On Device</h4>
                  <p className="text-sm text-text-light">
                    Hold the power button for 3 seconds until the LED turns blue. The device will automatically search for networks.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">Add to TracSync</h4>
                  <p className="text-sm text-text-light">
                    In TracSync Settings, click "Add Tracker" and enter the 4-digit code displayed on your device screen.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Start Tracking</h4>
                  <p className="text-sm text-text-light">
                    Once connected, your routes will automatically sync to TracSync in real-time. Green LED indicates active tracking.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Pro Tip:</strong> For best results, ensure your Pocket Tracker has a clear view of the sky and is fully charged before your first tracking session.
                </p>
              </div>
            </div> */}

            {/* Technical Specifications */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Battery size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Extended Battery</h3>
                <p className="text-text-light text-sm">
                  Lithium-ion battery with intelligent power management for up to 30 days of continuous tracking.
                </p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Wifi size={24} className="text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Connectivity</h3>
                <p className="text-text-light text-sm">
                  4G LTE, WiFi, and Bluetooth connectivity with automatic failover for reliable data transmission.
                </p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Durability</h3>
                <p className="text-text-light text-sm">
                  Military-grade construction with IP68 waterproof rating and shock-resistant design.
                </p>
              </div>
            </div> */}

          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Track Your Adventures
            </h2>
            <p className="text-xl text-text-light max-w-2xl mx-auto">
              Powerful features designed for outdoor enthusiasts, athletes, and anyone who loves to explore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-text-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-text-light">Routes Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <div className="text-text-light">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-text-light">Kilometers Recorded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-text-light">Uptime</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      {/* <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Adventurers Worldwide
            </h2>
            <p className="text-xl text-text-light">
              See what our users have to say about their tracking experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-text-light mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-text-light">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Tracking?
          </h2>
          <p className="text-xl text-text-light mb-8">
            Join thousands of adventurers who trust TracSync for their journey analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-text-light">
              <CheckCircle size={20} className="text-green-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2 text-text-light">
              <CheckCircle size={20} className="text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-text-light">
              <CheckCircle size={20} className="text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="btn btn-primary text-lg px-8 py-3 flex items-center gap-2 mx-auto sm:mx-0"
            >
              Get Started Now
              <ArrowRight size={20} />
            </button>
            <Link 
              to="/pricing"
              className="btn btn-outline text-lg px-8 py-3 flex items-center gap-2 mx-auto sm:mx-0"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-white p-2 rounded-lg">
                  <MapPin size={20} />
                </div>
                <span className="text-lg font-bold">TracSync</span>
              </div>
              <p className="text-text-light">
                The ultimate platform for tracking and analyzing your GPS routes and adventures.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-text-light">
                <li><Link to="/dashboard" className="hover:text-text transition-colors">Dashboard</Link></li>
                <li><Link to="/upload" className="hover:text-text transition-colors">Upload Routes</Link></li>
                <li><Link to="/settings" className="hover:text-text transition-colors">Settings</Link></li>
                <li><Link to="/pricing" className="hover:text-text transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Hardware</h3>
              <ul className="space-y-2 text-text-light">
                <li><a href="https://pockettracker.com" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">Pocket Tracker</a></li>
                <li><a href="https://pockettracker.com/support" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">Device Support</a></li>
                <li><a href="https://pockettracker.com/specs" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">Specifications</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-text-light">
                <li><a href="#" className="hover:text-text transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-text transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-text transition-colors">API Docs</a></li>
                <li><button onClick={() => setShowInstallInstructions(true)} className="hover:text-text transition-colors">Install App</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-text-light">
            <p>&copy; 2024 TracSync. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* PWA Install Instructions Modal */}
      {showInstallInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card max-w-2xl w-full p-6 fade-in slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Download size={24} className="text-primary" />
                Install TracSync App
              </h2>
              <button
                onClick={() => setShowInstallInstructions(false)}
                className="p-2 rounded-lg hover:bg-background transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* iOS Instructions */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Smartphone size={20} />
                  iOS (iPhone/iPad)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-text-light">
                  <li>Open TracSync in Safari browser</li>
                  <li>Tap the Share button <Share2 size={14} className="inline" /> at the bottom</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to confirm installation</li>
                  <li>TracSync will appear on your home screen like a native app</li>
                </ol>
              </div>

              {/* Android Instructions */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Smartphone size={20} />
                  Android
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-text-light">
                  <li>Open TracSync in Chrome browser</li>
                  <li>Tap the menu (⋮) in the top right corner</li>
                  <li>Select "Add to Home screen" or "Install app"</li>
                  <li>Tap "Add" or "Install" to confirm</li>
                  <li>TracSync will be installed as a native app</li>
                </ol>
              </div>

              {/* Desktop Instructions */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Monitor size={20} />
                  Desktop (Chrome/Edge)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-text-light">
                  <li>Look for the install icon <Plus size={14} className="inline" /> in the address bar</li>
                  <li>Click the install icon or "Install TracSync" button</li>
                  <li>Click "Install" in the confirmation dialog</li>
                  <li>TracSync will open as a desktop app</li>
                </ol>
              </div>

              {/* Benefits */}
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-primary">Benefits of Installing</h3>
                <ul className="space-y-2 text-sm text-text-light">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Works offline for viewing saved routes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Faster loading and native app experience
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Push notifications for tracker updates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    No app store required - installs directly
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowInstallInstructions(false)}
                className="btn btn-primary"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};

// Monitor component for desktop instructions
const Monitor: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

// X component for close button
const X: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default Landing;