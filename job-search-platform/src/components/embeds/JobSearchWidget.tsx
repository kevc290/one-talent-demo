import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, ArrowRight, Loader, Heart } from 'lucide-react';
import { jobsService } from '../../services/jobsService';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { Job } from '../../data/jobs';

export function JobSearchWidget() {
  const { user, isAuthenticated } = useAuth();
  const { currentBrand } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const filters = [
    { id: 'remote', label: 'Remote' },
    { id: 'fulltime', label: 'Full-time' },
    { id: 'parttime', label: 'Part-time' },
    { id: 'contract', label: 'Contract' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  // Load featured jobs on mount
  useEffect(() => {
    loadFeaturedJobs();
  }, []);

  const loadFeaturedJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobsService.getJobs({ limit: 3 });
      setJobs(response.data.slice(0, 3)); // Show only 3 featured jobs
    } catch (error) {
      console.error('Failed to load featured jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setHasSearched(true);
      
      const searchParams: any = {
        limit: 6
      };
      
      if (searchQuery.trim()) {
        searchParams.search = searchQuery.trim();
      }
      
      if (location.trim()) {
        searchParams.location = location.trim();
      }
      
      // Map selected filters to search params
      if (selectedFilters.includes('remote')) {
        searchParams.remote = 'true';
      }
      
      if (selectedFilters.includes('fulltime')) {
        searchParams.type = 'Full-time';
      } else if (selectedFilters.includes('parttime')) {
        searchParams.type = 'Part-time';
      } else if (selectedFilters.includes('contract')) {
        searchParams.type = 'Contract';
      }
      
      const response = await jobsService.getJobs(searchParams);
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to search jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleApply = (job: Job) => {
    // Redirect to main app with job application
    const targetUrl = import.meta.env.PROD ? `/one-talent-demo/job/${job.id}` : `/job/${job.id}`;
    window.location.href = targetUrl;
  };


  return (
    <div className="bg-white rounded-xl shadow-lg max-w-4xl mx-auto overflow-hidden">
      {/* JobSearch Pro Header */}
      <div className={`px-6 py-4 border-b border-gray-200 ${
        currentBrand.colors.primary === 'blue' ? 'bg-blue-600' : 
        currentBrand.colors.primary === 'purple' ? 'bg-purple-600' : 
        currentBrand.colors.primary === 'gray' ? 'bg-gray-700' : 'bg-emerald-600'
      }`}>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{currentBrand.logo}</span>
          <div>
            <h3 className="text-lg font-bold text-white">
              {currentBrand.name}
            </h3>
            <p className="text-sm text-white/80">Powered job search widget</p>
          </div>
        </div>
      </div>
      
      {/* Search Content */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h4 className="text-2xl font-bold text-gray-900">Find Your Dream Job</h4>
          <p className="text-gray-600">Search from thousands of opportunities</p>
        </div>

        {/* Search Form */}
        <div className="space-y-4">
          {/* Main Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Location Search */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="City, state, or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {selectedFilters.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {selectedFilters.length}
                </span>
              )}
            </button>

            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: currentBrand.cssVars['--color-accent']
              }}
              onMouseEnter={(e) => {
                const accent = currentBrand.cssVars['--color-accent'];
                if (accent === '#00ae42') {
                  e.currentTarget.style.backgroundColor = '#009638';
                } else if (accent === '#10B981') {
                  e.currentTarget.style.backgroundColor = '#047857';
                } else {
                  e.currentTarget.style.backgroundColor = accent;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-accent'];
              }}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Search Jobs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg animate-fadeIn">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedFilters.includes(filter.id)
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200'
                  } border`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Jobs Results */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Briefcase className="w-4 h-4" />
            <span>{hasSearched ? `Search Results (${jobs.length})` : 'Featured Opportunities'}</span>
          </h4>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-2">
              {jobs.map(job => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex-1 space-y-1 text-left">
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {job.company} • {job.location}
                      {job.remote && <span className="ml-2" style={{ color: currentBrand.cssVars['--color-accent'] }}>Remote</span>}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium" style={{ color: currentBrand.cssVars['--color-accent'] }}>
                        ${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k
                      </span>
                      <span className="text-gray-500 ml-3">{job.type}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <button
                      onClick={() => window.location.href = import.meta.env.PROD ? `/one-talent-demo/job/${job.id}` : `/job/${job.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleApply(job)}
                      className="px-3 py-1 rounded text-sm font-medium text-white transition-colors"
                      style={{ 
                        backgroundColor: currentBrand.cssVars['--color-accent']
                      }}
                      onMouseEnter={(e) => {
                        const accent = currentBrand.cssVars['--color-accent'];
                        if (accent === '#00ae42') {
                          e.currentTarget.style.backgroundColor = '#009638';
                        } else if (accent === '#10B981') {
                          e.currentTarget.style.backgroundColor = '#047857';
                        } else {
                          e.currentTarget.style.backgroundColor = accent;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-accent'];
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No jobs found matching your criteria</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : null}

          {jobs.length > 0 && (
            <button
              onClick={() => window.location.href = import.meta.env.PROD ? '/one-talent-demo/jobs' : '/jobs'}
              className="block w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2 transition-colors"
            >
              View all jobs →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}