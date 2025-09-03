import { useState, useEffect } from 'react';
import { Heart, Briefcase } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { SkeletonCard } from '../components/SkeletonCard';
import { ErrorState } from '../components/ErrorState';
import { jobsService } from '../services/jobsService';
import { useAuth } from '../contexts/AuthContext';
import type { Job } from '../data/jobs';

export function SavedJobs() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSavedJobs = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const jobs = await jobsService.getSavedJobs();
      setSavedJobs(jobs);
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load saved jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadSavedJobs();
    }
  }, [user]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Saved Jobs' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <SkeletonCard key={i} view="grid" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <ErrorState
            type="error"
            title="Failed to load saved jobs"
            message={error}
            onRetry={loadSavedJobs}
            showRetry={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            My Saved Jobs
          </h1>
          <p className="text-gray-600">
            Jobs you've saved for later review ({savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''})
          </p>
        </div>

        {/* Saved Jobs */}
        {savedJobs.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No saved jobs yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring job opportunities and save the ones that interest you. 
              They'll appear here for easy access later.
            </p>
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Briefcase className="w-5 h-5" />
              Browse Jobs
            </a>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
            {savedJobs.map((job, index) => (
              <div 
                key={job.id} 
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <JobCard job={job} view="grid" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}