import { MapPin, DollarSign, Building2, Calendar, Heart, ExternalLink } from 'lucide-react';
import type { Job } from '../data/jobs';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jobsService } from '../services/jobsService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface JobCardProps {
  job: Job;
  view: 'grid' | 'list';
}

export function JobCard({ job, view }: JobCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentBrand } = useTheme();
  const [isSaved, setIsSaved] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    // Check if job is saved when component mounts (only for authenticated users)
    if (isAuthenticated) {
      setIsSaved(jobsService.isJobSaved(job.id));
    } else {
      setIsSaved(false);
    }
  }, [job.id, isAuthenticated]);

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  const handleSaveJob = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    try {
      if (isSaved) {
        await jobsService.unsaveJob(job.id);
        setIsSaved(false);
      } else {
        await jobsService.saveJob(job.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to save/unsave job:', error);
      // Fallback to local storage for backward compatibility
      if (isSaved) {
        jobsService.unsaveJobLocally(job.id);
        setIsSaved(false);
      } else {
        jobsService.saveJobLocally(job.id);
        setIsSaved(true);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Posted today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (view === 'list') {
    return (
      <div 
        className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover-lift animate-fadeIn"
        style={{
          '--hover-border-color': currentBrand.cssVars['--color-accent']
        } as React.CSSProperties}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = currentBrand.cssVars['--color-accent'] + '40'; // 25% opacity
          setShowQuickActions(true);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#f3f4f6';
          setShowQuickActions(false);
        }}
      >
        <Link to={`/job/${job.id}`} className="block">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 transition-colors"
                    style={{
                      color: '#111827'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#111827';
                    }}>
                  {job.title}
                </h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full transition-colors"
                      style={{
                        backgroundColor: currentBrand.cssVars['--color-accent'] + '20', // 12% opacity
                        color: currentBrand.cssVars['--color-accent']
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-accent'] + '30'; // 18% opacity
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-accent'] + '20';
                      }}>
                  {job.type}
                </span>
                {job.remote && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: currentBrand.cssVars['--color-accent'] + '20',
                          color: currentBrand.cssVars['--color-accent']
                        }}>
                    Remote
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(job.postedDate)}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
            </div>
            <div className="flex items-center gap-2 font-semibold"
                 style={{ color: currentBrand.cssVars['--color-accent'] }}>
              <DollarSign className="w-5 h-5" />
              {formatSalary(job.salary.min, job.salary.max)}
            </div>
          </div>
        </Link>
        
        {/* Quick Actions */}
        <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-200 ${
          showQuickActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}>
          <button
            onClick={handleSaveJob}
            className={`p-2 rounded-full transition-all duration-200 ${
              isSaved 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600'
            }`}
            style={!isSaved ? {
              '--hover-bg': currentBrand.cssVars['--color-accent'] + '20',
              '--hover-color': currentBrand.cssVars['--color-accent']
            } as React.CSSProperties : {}}
            onMouseEnter={(e) => {
              if (!isSaved) {
                e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-accent'] + '20';
                e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaved) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#4b5563';
              }
            }}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <Link
            to={`/job/${job.id}`}
            className="p-2 rounded-full transition-colors"
            style={{
              backgroundColor: currentBrand.cssVars['--color-accent'] + '20',
              color: currentBrand.cssVars['--color-accent']
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-accent'] + '30';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-accent'] + '20';
            }}
            title="View details"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full hover-lift animate-fadeIn"
      style={{
        '--hover-border-color': currentBrand.cssVars['--color-accent']
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = currentBrand.cssVars['--color-accent'] + '40'; // 25% opacity
        setShowQuickActions(true);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f3f4f6';
        setShowQuickActions(false);
      }}
    >
      <Link to={`/job/${job.id}`} className="block h-full flex flex-col">
        <div className="mb-3 flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 transition-colors"
                style={{
                  color: '#111827'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#111827';
                }}>
              {job.title}
            </h3>
            <div className="flex flex-col gap-1 ml-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors"
                    style={{
                      backgroundColor: currentBrand.cssVars['--color-accent'] + '20', // 12% opacity
                      color: currentBrand.cssVars['--color-accent']
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-accent'] + '30'; // 18% opacity
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-accent'] + '20';
                    }}>
                {job.type}
              </span>
              {job.remote && (
                <span className="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: currentBrand.cssVars['--color-accent'] + '20',
                        color: currentBrand.cssVars['--color-accent']
                      }}>
                  Remote
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{job.company}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-3">{job.description}</p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-1 font-semibold text-sm"
               style={{ color: currentBrand.cssVars['--color-accent'] }}>
            <DollarSign className="w-4 h-4" />
            {formatSalary(job.salary.min, job.salary.max)}
          </div>
          <span className="text-xs text-gray-500">{formatDate(job.postedDate)}</span>
        </div>
      </Link>
      
      {/* Quick Actions */}
      <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-200 ${
        showQuickActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
      }`}>
        <button
          onClick={handleSaveJob}
          className={`p-2 rounded-full transition-all duration-200 ${
            isSaved 
              ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-scaleIn' 
              : 'bg-gray-100 text-gray-600'
          }`}
          style={!isSaved ? {
            '--hover-bg': currentBrand.cssVars['--color-accent'] + '20',
            '--hover-color': currentBrand.cssVars['--color-accent']
          } as React.CSSProperties : {}}
          onMouseEnter={(e) => {
            if (!isSaved) {
              e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-accent'] + '20';
              e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
            }
          }}
          onMouseLeave={(e) => {
            if (!isSaved) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#4b5563';
            }
          }}
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          <Heart className={`w-4 h-4 transition-all duration-200 ${isSaved ? 'fill-current scale-110' : ''}`} />
        </button>
      </div>
    </div>
  );
}