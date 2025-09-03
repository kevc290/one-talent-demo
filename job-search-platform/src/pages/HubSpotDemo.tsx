import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Users, Building2, Briefcase, Star, ChevronRight, User, ChevronDown } from 'lucide-react';
import { JobSearchWidget } from '../components/embeds/JobSearchWidget';
import { MiniJobListings } from '../components/embeds/MiniJobListings';
import { LoginWidget } from '../components/embeds/LoginWidget';
import { useAuth } from '../contexts/AuthContext';

export function HubSpotDemo() {
  const { user, isAuthenticated } = useAuth();
  const [activeDemo, setActiveDemo] = useState<'search' | 'listings' | 'login'>('search');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* HubSpot-style Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HS</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">HubSpot</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Software</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Resources</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Partners</a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Customer Support</a>
              
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-700 font-medium">{user.firstName} {user.lastName}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4" />
                  <span>Trusted by 10,000+ companies</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Embed powerful
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> job search</span> 
                  <br />into your website
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Seamlessly integrate our job search platform into your HubSpot pages. Boost engagement and provide value to your visitors with embedded job widgets.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white text-lg font-semibold rounded-xl hover:bg-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Try Free Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button 
                  onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Video
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Active Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Embedded Job Search Widget */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-1 transform rotate-2">
                <div className="bg-gray-50 rounded-xl p-6 transform -rotate-2">
                  <div className="bg-white rounded-lg shadow-lg">
                    <JobSearchWidget />
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section id="demo-video" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-gray-900">See It In Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how our job search widgets seamlessly integrate into your HubSpot pages and provide a smooth user experience.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8">
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                <video
                  controls
                  className="w-full h-full object-cover"
                  poster="/videos/Job_Search.mp4?t=0.1"
                >
                  <source src="/videos/Job_Search.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video overlay for better UX */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Video description */}
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Seamless HubSpot Integration
                </h3>
                <p className="text-gray-600">
                  Experience how our widgets work within HubSpot's ecosystem, maintaining your brand while providing powerful job search functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Powerful Integration Options</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from multiple embed options to perfectly match your HubSpot pages and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Job Search Widget</h3>
              <p className="text-gray-600">Full-featured search with filters and real-time results</p>
            </div>

            <div className="text-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mini Listings</h3>
              <p className="text-gray-600">Compact job listings perfect for sidebars</p>
            </div>

            <div className="text-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Widget</h3>
              <p className="text-gray-600">Seamless authentication for returning users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Widget Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Interactive Widget Demo</h2>
            <p className="text-xl text-gray-600">Try our embeddable components live</p>
          </div>

          {/* Widget Selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-xl p-1 shadow-lg">
              <button
                onClick={() => setActiveDemo('search')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeDemo === 'search'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Search Widget
              </button>
              <button
                onClick={() => setActiveDemo('listings')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeDemo === 'listings'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mini Listings
              </button>
              <button
                onClick={() => setActiveDemo('login')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeDemo === 'login'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Login Widget
              </button>
            </div>
          </div>

          {/* Widget Display */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-500">
              {activeDemo === 'search' && <JobSearchWidget />}
              {activeDemo === 'listings' && <MiniJobListings />}
              {activeDemo === 'login' && <LoginWidget />}
            </div>
          </div>

          {/* Integration Code Example */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-gray-900 rounded-xl p-6 text-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-medium">Embed Code</span>
                <button className="text-blue-400 hover:text-blue-300 text-sm">Copy to clipboard</button>
              </div>
              <pre className="text-green-400 overflow-x-auto">
                <code>{`<script src="https://widgets.jobsearch.com/embed.js"></script>
<div data-jobsearch-widget="${activeDemo}" data-theme="modern"></div>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">Ready to embed job search in your HubSpot pages?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of companies using our widgets to drive engagement and provide value to their visitors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
              >
                Start Free Trial
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white text-lg font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}