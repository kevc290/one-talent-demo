import { useState, useEffect } from 'react';
import { Grid3x3, List, Loader, Filter } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterButton } from '../components/FilterButton';
import { JobCard } from '../components/JobCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { SkeletonCard } from '../components/SkeletonCard';
import { ErrorState } from '../components/ErrorState';
import { jobsService, type JobFilters } from '../services/jobsService';
import type { Job } from '../data/jobs';
import { useTheme } from '../contexts/ThemeContext';

export function JobSearch() {
  const { currentBrand } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);

  const filters = ['Remote', 'Full-time', 'Part-time', 'Contract'];

  const loadJobs = async () => {
    try {
      setError(null);
      setIsSearching(true);
      
      const filters: JobFilters = {
        ...(searchTerm && { search: searchTerm }),
        ...(activeFilters.length > 0 && { type: activeFilters })
      };
      
      const response = await jobsService.getJobs({ ...filters, limit: 50 });
      setJobs(response.data);
      setTotalJobs(response.pagination.totalItems);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadJobs();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, activeFilters]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };


  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Jobs' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6 skeleton"></div>
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 skeleton"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 skeleton"></div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="h-12 bg-gray-200 rounded mb-4 skeleton"></div>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-20 bg-gray-200 rounded-full skeleton"></div>
                ))}
              </div>
            </div>
            <div className={`grid gap-6 ${viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
            }`}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <SkeletonCard key={i} view={viewMode} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">Discover opportunities across software, healthcare, and manufacturing</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 md:p-6 mb-6 animate-slideIn">
          <div className="mb-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 mr-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              {filters.map(filter => (
                <FilterButton
                  key={filter}
                  label={filter}
                  isActive={activeFilters.includes(filter)}
                  onClick={() => toggleFilter(filter)}
                />
              ))}
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-4">
              {activeFilters.length > 0 && (
                <span className="text-sm px-2 py-1 rounded-full animate-scaleIn"
                      style={{
                        backgroundColor: currentBrand.cssVars['--color-accent'] + '20',
                        color: currentBrand.cssVars['--color-accent']
                      }}>
                  {activeFilters.length} active
                </span>
              )}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all duration-200 transform hover:scale-105 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm' 
                      : 'text-gray-600'
                  }`}
                  style={viewMode === 'grid' 
                    ? { color: currentBrand.cssVars['--color-accent'] }
                    : {
                        '--hover-color': currentBrand.cssVars['--color-accent']
                      } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    if (viewMode !== 'grid') {
                      e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== 'grid') {
                      e.currentTarget.style.color = '#4b5563';
                    }
                  }}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all duration-200 transform hover:scale-105 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm' 
                      : 'text-gray-600'
                  }`}
                  style={viewMode === 'list' 
                    ? { color: currentBrand.cssVars['--color-accent'] }
                    : {
                        '--hover-color': currentBrand.cssVars['--color-accent']
                      } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    if (viewMode !== 'list') {
                      e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== 'list') {
                      e.currentTarget.style.color = '#4b5563';
                    }
                  }}
                  aria-label="List view"
                >
                  <List className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header with Loading State */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-gray-600">
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Searching...
                </span>
              ) : (
                <>
                  Showing <span className="font-semibold text-gray-900">{jobs.length}</span> of {totalJobs} job{jobs.length !== 1 ? 's' : ''}
                </>
              )}
            </p>
            {activeFilters.length > 0 && !isSearching && (
              <button
                onClick={() => setActiveFilters([])}
                className="text-sm font-medium transition-colors"
                style={{
                  color: currentBrand.cssVars['--color-accent'],
                  '--hover-color': currentBrand.colors.primary === 'kelly' ? '#009638' : currentBrand.cssVars['--color-primary-hover']
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  const hoverColor = currentBrand.colors.primary === 'kelly' ? '#009638' : currentBrand.cssVars['--color-primary-hover'];
                  e.currentTarget.style.color = hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Job Cards with Loading State */}
        {isSearching ? (
          <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
          }`}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <SkeletonCard key={i} view={viewMode} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            type="generic"
            title="Failed to load jobs"
            message={error}
            onRetry={loadJobs}
            showRetry={true}
          />
        ) : jobs.length > 0 ? (
          <div 
            className={`transition-all duration-300 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
                : 'space-y-4'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            {jobs.map((job, index) => (
              <div 
                key={job.id} 
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <JobCard job={job} view={viewMode} />
              </div>
            ))}
          </div>
        ) : (
          <ErrorState
            type="not-found"
            title="No jobs found"
            message="We couldn't find any jobs matching your criteria. Try adjusting your search terms or filters."
            onRetry={() => {
              setSearchTerm('');
              setActiveFilters([]);
            }}
            showRetry={searchTerm !== '' || activeFilters.length > 0}
          />
        )}
      </div>
    </div>
  );
}