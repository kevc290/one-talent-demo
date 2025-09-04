import { useState, useEffect } from 'react';
import { MapPin, Clock, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { jobs } from '../../data/jobs';
import type { Job } from '../../data/jobs';

export function MiniJobListings() {
  const { currentBrand } = useTheme();
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  // Use first 5 jobs from the main jobs data
  const displayJobs = jobs.slice(0, 5);

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
        currentBrand.colors.primary === 'blue' ? 'bg-blue-50' : 
        currentBrand.colors.primary === 'purple' ? 'bg-purple-50' : 'bg-emerald-50'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{currentBrand.logo}</span>
          <div>
            <h3 className={`text-sm font-bold ${
              currentBrand.colors.primary === 'blue' ? 'text-blue-600' : 
              currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'
            }`}>
              {currentBrand.name}
            </h3>
            <p className="text-xs text-gray-600">Job listings widget</p>
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
              className="group p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
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
                    <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">
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
                  className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                >
                  {savedJobs.includes(job.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-blue-600" />
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
                    <div className="text-sm font-medium text-green-600">${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{job.type}</div>
                  </div>
                  
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700">
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
            className={`w-full text-sm font-medium py-2 px-4 rounded-lg transition-colors ${
              currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' : 
              currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            View All Jobs →
          </button>
        </div>
      </div>
    </div>
  );
}