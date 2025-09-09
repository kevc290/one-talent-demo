import { useState, useEffect } from 'react';
import { MapPin, Clock, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { jobs } from '../../data/jobs';
import type { Job } from '../../data/jobs';

export function MiniJobListings() {
  const { currentBrand } = useTheme();
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  // Sort jobs by most recent date and take first 5
  const displayJobs = [...jobs]
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, 5);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-sm mx-auto overflow-hidden">
      {/* JobSearch Pro Header */}
      <div className={`px-4 py-3 border-b border-gray-200 ${
        currentBrand.colors.primary === 'blue' ? 'bg-blue-600' : 
        currentBrand.colors.primary === 'purple' ? 'bg-purple-600' : 
        currentBrand.colors.primary === 'gray' ? 'bg-gray-700' : 'bg-emerald-600'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{currentBrand.logo}</span>
          <div>
            <h3 className="text-sm font-bold text-white">
              {currentBrand.name}
            </h3>
            <p className="text-xs text-white/80">Job listings widget</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h4 className="font-bold text-gray-900">Latest Jobs</h4>
          <span className="text-sm text-gray-500">{displayJobs.length} new</span>
        </div>

        {/* Job List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {displayJobs.map(job => (
            <div
              key={job.id}
              onClick={() => window.location.href = import.meta.env.PROD ? `/one-talent-demo/job/${job.id}` : `/job/${job.id}`}
              className="group p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
              style={{
                '--hover-border-color': currentBrand.cssVars['--color-accent']
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = currentBrand.cssVars['--color-accent'] + '40';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {/* Job Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3 flex-1">
                  <img
                    src={job.companyLogo}
                    alt={`${job.company} logo`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm transition-colors truncate"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#111827';
                        }}>
                      {job.title}
                    </h4>
                    <p className="text-xs text-gray-600">{job.company}</p>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job.id);
                  }}
                  className="text-gray-400 transition-colors p-1"
                  style={{
                    '--hover-color': currentBrand.cssVars['--color-accent']
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#9ca3af';
                  }}
                >
                  {savedJobs.includes(job.id) ? (
                    <BookmarkCheck className="w-4 h-4" style={{ color: currentBrand.cssVars['--color-accent'] }} />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Job Details */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium" style={{ color: currentBrand.cssVars['--color-accent'] }}>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{job.type}</div>
                  </div>
                  
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity"
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
                          }}>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t">
          <button 
            onClick={() => window.location.href = import.meta.env.PROD ? '/one-talent-demo/jobs' : '/jobs'}
            className="w-full text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            style={{ 
              color: currentBrand.cssVars['--color-accent'],
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              const accent = currentBrand.cssVars['--color-accent'];
              if (accent === '#00ae42') {
                e.currentTarget.style.backgroundColor = '#f0f9ff';
                e.currentTarget.style.color = '#009638';
              } else if (accent === '#10B981') {
                e.currentTarget.style.backgroundColor = '#ecfdf5';
                e.currentTarget.style.color = '#047857';
              } else {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
            }}
          >
            View All Jobs →
          </button>
        </div>
      </div>
    </div>
  );
}