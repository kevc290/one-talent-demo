import { Link } from 'react-router-dom';
import { ArrowRight, Search, Filter, Users } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/ThemeContext';

export function Home() {
  const { currentBrand } = useTheme();
  const breadcrumbItems = [
    { label: 'Home' }
  ];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find Your <span className={`${
              currentBrand.colors.primary === 'blue' ? 'text-blue-600' : 
              currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'
            }`}>Perfect Job</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover opportunities across software, healthcare, and manufacturing industries. 
            Your dream career is just a click away.
          </p>
          <Link
            to="/jobs"
            className={`inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-lg transition-colors shadow-lg ${
              currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
              currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            Start Your Job Search
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose {currentBrand.name}?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${
              currentBrand.colors.primary === 'blue' ? 'bg-blue-100' : 
              currentBrand.colors.primary === 'purple' ? 'bg-purple-100' : 'bg-emerald-100'
            }`}>
              <Search className={`w-8 h-8 ${
                currentBrand.colors.primary === 'blue' ? 'text-blue-600' : 
                currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'
              }`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Search</h3>
            <p className="text-gray-600">
              Find the perfect job with our intelligent search system that matches your skills and preferences
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${
              currentBrand.colors.primary === 'blue' ? 'bg-blue-100' : 
              currentBrand.colors.primary === 'purple' ? 'bg-purple-100' : 'bg-emerald-100'
            }`}>
              <Filter className={`w-8 h-8 ${
                currentBrand.colors.primary === 'blue' ? 'text-blue-600' : 
                currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'
              }`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Filters</h3>
            <p className="text-gray-600">
              Filter by location, salary, job type, and industry to find exactly what you're looking for
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${
              currentBrand.colors.primary === 'blue' ? 'bg-blue-100' : 
              currentBrand.colors.primary === 'purple' ? 'bg-purple-100' : 'bg-emerald-100'
            }`}>
              <Users className={`w-8 h-8 ${
                currentBrand.colors.primary === 'blue' ? 'text-blue-600' : 
                currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'
              }`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Top Companies</h3>
            <p className="text-gray-600">
              Connect with leading companies across multiple industries hiring right now
            </p>
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