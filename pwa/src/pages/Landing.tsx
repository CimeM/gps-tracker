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
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

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
      icon: <MapPin className="text-primary\" size={24} />,
      title: 'Real-time Tracking',
      description: 'Track your GPS routes in real-time with precise location data and comprehensive analytics.'
    },
    {
      icon: <Route className="text-primary" size={24} />,
      title: 'Route Visualization',
      description: 'Visualize your routes on interactive maps with elevation profiles and detailed metrics.'
    },
    {
      icon: <BarChart3 className="text-primary\" size={24} />,
      title: 'Advanced Analytics',
      description: 'Get detailed insights with charts showing speed, elevation, heart rate, and more.'
    },
    {
      icon: <Shield className="text-primary" size={24} />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely with full privacy protection.'
    },
    {
      icon: <Smartphone className="text-primary\" size={24} />,
      title: 'Mobile Ready',
      description: 'Access your routes anywhere with our responsive Progressive Web App.'
    },
    {
      icon: <Cloud className="text-primary" size={24} />,
      title: 'Cloud Sync',
      description: 'Automatic synchronization across all your devices with cloud backup.'
    }
  ];

  const hardwareFeatures = [
    {
      icon: <Zap className="text-accent\" size={20} />,
      title: 'Ultra-Low Power',
      description: 'Up to 30 days battery life with continuous tracking'
    },
    {
      icon: <Wifi className="text-accent" size={20} />,
      title: 'Real-time Sync',
      description: 'Instant data synchronization via cellular or WiFi'
    },
    {
      icon: <Shield className="text-accent\" size={20} />,
      title: 'Waterproof Design',
      description: 'IP68 rated for all weather conditions'
    },
    {
      icon: <MapIcon className="text-accent" size={20} />,
      title: 'Precision GPS',
      description: 'Sub-meter accuracy with multi-constellation support'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Trail Runner',
      content: 'This app has completely transformed how I track my running routes. The elevation charts are incredibly detailed!',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-lg">
                <MapPin size={20} />
              </div>
              <span className="text-xl font-bold">GPS Route Tracker</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/pricing" className="text-text-light hover:text-text transition-colors">
                Pricing
              </Link>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard" className="text-text-light hover:text-text transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/dashboard" className="btn btn-primary">
                    Go to App
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleSignIn}
                    className="text-text-light hover:text-text transition-colors flex items-center gap-2"
                  >
                    <LogIn size={18} />
                    Sign In
                  </button>
                  <button 
                    onClick={handleGetStarted}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <User size={18} />
                    Get Started
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
              Track Every Journey
            </h1>
            <p className="text-xl text-text-light mb-8 max-w-3xl mx-auto">
              Visualize, analyze, and share your GPS routes with our powerful tracking platform. 
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
              <button className="btn btn-outline text-lg px-8 py-3 flex items-center gap-2">
                <Play size={20} />
                Watch Demo
              </button>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 backdrop-blur-sm border border-border">
                <div className="bg-card rounded-xl p-6 shadow-lg">
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
              Connect your professional GPS tracking devices for seamless data collection and real-time monitoring.
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
                      <p className="text-text-light">Professional GPS Tracking Device</p>
                    </div>
                  </div>
                  
                  <p className="text-text-light mb-6">
                    The Pocket Tracker is a compact, professional-grade GPS device designed for 
                    outdoor enthusiasts and professionals who need reliable, accurate tracking 
                    with extended battery life.
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
                    <button 
                      onClick={handleGetStarted}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      Connect Device
                      <ArrowRight size={18} />
                    </button>
                    <button className="btn btn-outline">
                      View Specifications
                    </button>
                  </div>
                </div>

                <div className="relative">
                  {/* Device Mockup */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                    <div className="bg-gray-700 rounded-xl p-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="text-green-400 text-xs font-mono">TRACKING</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-300">
                          <span>Battery</span>
                          <span className="text-green-400">87%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-1">
                          <div className="bg-green-400 h-1 rounded-full w-[87%]"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-300 mt-3">
                          <span>Signal</span>
                          <span className="text-green-400">Strong</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-300">
                          <span>Satellites</span>
                          <span className="text-green-400">12/12</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">Pocket Tracker</div>
                      <div className="text-gray-400 text-sm">Model PT-2024</div>
                    </div>
                  </div>
                  
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -right-4 bg-card rounded-lg p-3 shadow-lg border border-border">
                    <div className="text-xs text-text-light">Accuracy</div>
                    <div className="text-lg font-bold text-accent">±0.5m</div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-card rounded-lg p-3 shadow-lg border border-border">
                    <div className="text-xs text-text-light">Battery Life</div>
                    <div className="text-lg font-bold text-primary">30 days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
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
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-text-light">Routes Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-text-light">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-text-light">Miles Recorded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-text-light">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card/50">
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
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Tracking?
          </h2>
          <p className="text-xl text-text-light mb-8">
            Join thousands of adventurers who trust GPS Route Tracker for their journey analytics.
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
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-white p-2 rounded-lg">
                  <MapPin size={20} />
                </div>
                <span className="text-lg font-bold">GPS Route Tracker</span>
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
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-text-light">
                <li><a href="#" className="hover:text-text transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-text transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-text transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-text-light">
                <li><a href="#" className="hover:text-text transition-colors">About</a></li>
                <li><a href="#" className="hover:text-text transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-text transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-text-light">
            <p>&copy; 2024 GPS Route Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default Landing;