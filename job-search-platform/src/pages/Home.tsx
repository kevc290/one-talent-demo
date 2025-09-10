import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowRight, Search, Filter, Users } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/ThemeContext';

// Declare the global JobSearchWidgets interface
declare global {
  interface Window {
    JobSearchWidgets?: {
      init: () => void;
      handleSearch: (widgetId: string) => void;
      handleLogin: (widgetId: string) => void;
      toggleProfile: (widgetId: string) => void;
      handleLogout: (widgetId: string) => void;
      version: string;
    };
  }
}

export function Home() {
  const { currentBrand } = useTheme();
  const breadcrumbItems = [
    { label: 'Home' }
  ];

  // Load embed script for job search widgets and reinitialize on brand change
  useEffect(() => {
    // Clear existing widget content to force recreation with new theme
    const clearWidgets = () => {
      const widgets = document.querySelectorAll('[data-jobsearch-widget]');
      widgets.forEach(widget => {
        // Clear the widget content and reset attributes
        widget.innerHTML = '';
        widget.removeAttribute('data-widget-id');
        widget.removeAttribute('data-widget-type');
      });
    };

    // First time loading: add the script
    if (!window.JobSearchWidgets) {
      const script = document.createElement('script');
      script.src = import.meta.env.PROD ? '/one-talent-demo/embed.js' : '/embed.js';
      script.async = true;
      
      script.onload = () => {
        if (window.JobSearchWidgets && window.JobSearchWidgets.init) {
          setTimeout(() => {
            window.JobSearchWidgets.init();
          }, 100);
        }
      };
      
      document.body.appendChild(script);
    } else {
      // Script already loaded, just clear and reinitialize widgets
      clearWidgets();
      setTimeout(() => {
        if (window.JobSearchWidgets && window.JobSearchWidgets.init) {
          window.JobSearchWidgets.init();
        }
      }, 100);
    }

    return () => {
      // Don't remove the script on cleanup as it might be needed again
    };
  }, [currentBrand]); // Re-run when brand changes

  return (
    <div className={`min-h-screen bg-gradient-to-br to-white ${
      currentBrand.colors.primary === 'blue' ? 'from-blue-50' : 
      currentBrand.colors.primary === 'purple' ? 'from-purple-50' : 'from-emerald-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[350px]">
          {/* Left Column - Content */}
          <div className="text-left lg:col-span-1 col-span-full">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Connecting People to <span className={`inline-block px-4 py-2 rounded-lg text-white ${
                currentBrand.colors.primary === 'blue' ? 'bg-blue-600' : 
                currentBrand.colors.primary === 'purple' ? 'bg-purple-600' : 'bg-emerald-600'
              }`}>Limitless</span> Opportunities
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Work with the industry leader who's breaking down barriers and helping job seekers worldwide connect with meaningful, transformative work.
            </p>
            
          </div>

          {/* Right Column - Image (Hidden on mobile/tablet) */}
          <div className="self-end justify-center lg:justify-end hidden lg:flex">
            <div className="relative">
              <img
                src={import.meta.env.PROD ? "/one-talent-demo/images/woman_phone.png" : "/images/woman_phone.png"}
                alt="Professional woman with phone"
                className="w-full max-w-sm h-auto object-contain max-h-[450px] "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Content Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Press Release */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold text-white ${
                  currentBrand.colors.primary === 'blue' ? 'bg-blue-600' : 
                  currentBrand.colors.primary === 'purple' ? 'bg-purple-600' : 'bg-emerald-600'
                }`}>
                  PRESS RELEASE
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                Everest Group Names Kelly a Leader and Star Performer in Professional, Industrial, IT and Engineering Staffing
              </h3>
              <a href="#" className="text-gray-900 font-medium underline hover:text-blue-600 transition-colors">
                Read more →
              </a>
            </div>

            {/* Sustainability */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold text-white ${
                  currentBrand.colors.primary === 'blue' ? 'bg-blue-600' : 
                  currentBrand.colors.primary === 'purple' ? 'bg-purple-600' : 'bg-emerald-600'
                }`}>
                  SUSTAINABILITY
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                Discover how Kelly works to ensure a sustainable future for all.
              </h3>
              <a href="#" className="text-gray-900 font-medium underline hover:text-blue-600 transition-colors">
                Read the report →
              </a>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold text-white ${
                  currentBrand.colors.primary === 'blue' ? 'bg-blue-600' : 
                  currentBrand.colors.primary === 'purple' ? 'bg-purple-600' : 'bg-emerald-600'
                }`}>
                  INSIGHTS
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                The Dishonest Job Search: 2,000+ voices reveal what's really happening in hiring
              </h3>
              <a href="#" className="text-gray-900 font-medium underline hover:text-blue-600 transition-colors">
                Read article →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Job Opportunities Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Job Opportunities</h2>
            <p className="text-lg text-gray-600">
              Explore the newest job openings tailored to your skills and career aspirations.
            </p>
          </div>
          
          {/* Embedded Job Search Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="flex justify-center">
              <div data-jobsearch-widget="search" data-theme={currentBrand.id}></div>
            </div>
            <div className="flex justify-center">
              <div data-jobsearch-widget="listings" data-theme={currentBrand.id}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`text-white py-16 ${
        currentBrand.colors.primary === 'blue' ? 'bg-blue-600' : 
        currentBrand.colors.primary === 'purple' ? 'bg-purple-600' : 'bg-emerald-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">20+</p>
              <p className={`${
                currentBrand.colors.primary === 'blue' ? 'text-blue-100' : 
                currentBrand.colors.primary === 'purple' ? 'text-purple-100' : 'text-emerald-100'
              }`}>Active Job Listings</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">3</p>
              <p className={`${
                currentBrand.colors.primary === 'blue' ? 'text-blue-100' : 
                currentBrand.colors.primary === 'purple' ? 'text-purple-100' : 'text-emerald-100'
              }`}>Industry Sectors</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">100%</p>
              <p className={`${
                currentBrand.colors.primary === 'blue' ? 'text-blue-100' : 
                currentBrand.colors.primary === 'purple' ? 'text-purple-100' : 'text-emerald-100'
              }`}>Free to Use</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Find Your Dream Job?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of job seekers who found their perfect match
        </p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Browse All Jobs
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}