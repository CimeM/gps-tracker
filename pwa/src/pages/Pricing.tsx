import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  X, 
  MapPin, 
  Cloud, 
  Shield, 
  Zap,
  Users,
  BarChart3,
  ArrowRight,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user, userProfile } = useAuth();

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for casual users and getting started',
      price: { monthly: 0, yearly: 0 },
      popular: false,
      features: [
        'Up to 10 GPX routes',
        '100MB storage',
        'Basic route visualization',
        'Export to common formats',
        'Mobile app access',
        'Community support'
      ],
      limitations: [
        'No advanced analytics',
        'No hardware tracker support',
        'No route sharing',
        'No API access'
      ],
      cta: 'Get Started Free',
      current: userProfile?.plan === 'free'
    },
    {
      name: 'Pro',
      description: 'For serious adventurers and professionals',
      price: { monthly: 9.99, yearly: 99.99 },
      popular: true,
      features: [
        'Unlimited GPX routes',
        '10GB storage',
        'Advanced analytics & insights',
        'Hardware tracker support',
        'Route sharing & collaboration',
        'Priority support',
        'API access',
        'Custom route planning',
        'Offline map downloads',
        'Export to all formats'
      ],
      limitations: [],
      cta: 'Upgrade to Pro',
      current: userProfile?.plan === 'pro'
    },
    {
      name: 'Enterprise',
      description: 'For teams and organizations',
      price: { monthly: 49.99, yearly: 499.99 },
      popular: false,
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'Team management',
        'Advanced security',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'White-label options',
        'Bulk hardware discounts',
        'Custom analytics'
      ],
      limitations: [],
      cta: 'Contact Sales',
      current: false
    }
  ];

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  const getYearlySavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    const monthlyCost = monthly * 12;
    return Math.round(((monthlyCost - yearly) / monthlyCost) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-lg">
                <MapPin size={20} />
              </div>
              <span className="text-xl font-bold">GPS Route Tracker</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/" className="text-text-light hover:text-text transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-text-light hover:text-text transition-colors">
                Dashboard
              </Link>
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to App
                </Link>
              ) : (
                <Link to="/" className="btn btn-primary">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Adventure Plan
          </h1>
          <p className="text-xl text-text-light max-w-3xl mx-auto mb-8">
            Start free and upgrade as your tracking needs grow. All plans include our core features 
            with no hidden fees or long-term commitments.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-text' : 'text-text-light'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-text' : 'text-text-light'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">
                Save up to 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`card relative overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-text-light text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      {formatPrice(plan.price[billingCycle])}
                    </span>
                    {plan.price[billingCycle] > 0 && (
                      <span className="text-text-light">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  
                  {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                    <div className="text-sm text-accent font-medium">
                      Save {getYearlySavings(plan.price.monthly, plan.price.yearly)}% annually
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-start gap-3 opacity-60">
                      <X size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`btn w-full ${
                    plan.current 
                      ? 'bg-gray-200 dark:bg-gray-700 text-text-light cursor-not-allowed'
                      : plan.popular 
                        ? 'btn-primary' 
                        : 'btn-outline'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : plan.cta}
                  {!plan.current && <ArrowRight size={18} className="ml-2" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="card p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4">Features</th>
                  <th className="text-center py-4 px-4">Free</th>
                  <th className="text-center py-4 px-4">Pro</th>
                  <th className="text-center py-4 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 px-4 font-medium">GPX Routes</td>
                  <td className="text-center py-4 px-4">10</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Storage</td>
                  <td className="text-center py-4 px-4">100MB</td>
                  <td className="text-center py-4 px-4">10GB</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Hardware Trackers</td>
                  <td className="text-center py-4 px-4"><X size={16} className="text-red-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check size={16} className="text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check size={16} className="text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Advanced Analytics</td>
                  <td className="text-center py-4 px-4"><X size={16} className="text-red-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check size={16} className="text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check size={16} className="text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">API Access</td>
                  <td className="text-center py-4 px-4"><X size={16} className="text-red-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check size={16} className="text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check size={16} className="text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Team Management</td>
                  <td className="text-center py-4 px-4"><X size={16} className="text-red-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><X size={16} className="text-red-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check size={16} className="text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="card p-6">
              <h3 className="font-semibold mb-3">Can I change plans anytime?</h3>
              <p className="text-text-light text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="font-semibold mb-3">What happens to my data if I downgrade?</h3>
              <p className="text-text-light text-sm">
                Your data is never deleted. If you exceed the new plan's limits, you'll have read-only 
                access until you upgrade or remove some routes.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="font-semibold mb-3">Do you offer refunds?</h3>
              <p className="text-text-light text-sm">
                We offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="font-semibold mb-3">Is my data secure?</h3>
              <p className="text-text-light text-sm">
                Absolutely. We use enterprise-grade encryption and security measures to protect your data. 
                Your routes are private by default.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Tracking?</h2>
          <p className="text-xl text-text-light mb-8">
            Join thousands of adventurers who trust GPS Route Tracker for their journey analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary text-lg px-8 py-3">
              Start Free Trial
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link to="/" className="btn btn-outline text-lg px-8 py-3">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;