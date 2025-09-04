import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Building2, Calendar, Briefcase, Users, Globe, Heart, ExternalLink, Check } from 'lucide-react';
import { ApplicationModal } from '../components/ApplicationModal';
import { Breadcrumb } from '../components/Breadcrumb';
import { CompanyLogo } from '../components/CompanyLogo';
import { jobsService } from '../services/jobsService';
import { applicationsService } from '../services/applicationsService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Job } from '../data/jobs';

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { currentBrand } = useTheme();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  const loadJob = async () => {
    if (!id) return;
    
    try {
      setError(null);
      setIsLoading(true);
      
      const jobData = await jobsService.getJobById(id);
      setJob(jobData);
      
      // Check if job is saved (only for authenticated users)
      if (isAuthenticated) {
        setIsSaved(jobsService.isJobSaved(id));
      } else {
        setIsSaved(false);
      }
      
      // Check if user has already applied
      if (isAuthenticated) {
        try {
          const applications = await applicationsService.getUserApplications();
          const hasAppliedToJob = applications.some(app => app.jobId === id);
          setHasApplied(hasAppliedToJob);
        } catch (err) {
          console.error('Failed to check application status:', err);
          // Fallback to checking local storage
          if (user?.id) {
            const localApplications = applicationsService.getUserApplicationsLocally(user.id);
            const hasAppliedToJob = localApplications.some(app => app.jobId === id);
            setHasApplied(hasAppliedToJob);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load job:', err);
      setError(err instanceof Error ? err.message : 'Failed to load job');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id, isAuthenticated]);

  const handleSaveJob = async () => {
    if (!job) return;
    
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
    } catch (err) {
      console.error('Failed to save/unsave job:', err);
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

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k per year`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className={`p-8 ${
                currentBrand.colors.primary === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 
                currentBrand.colors.primary === 'purple' ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
              }`}>
                <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-white/20 rounded w-1/2 mb-2"></div>
                <div className="h-5 bg-white/20 rounded w-1/4"></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/jobs')}
              className={`font-medium ${
                currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:text-blue-700' : 
                currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:text-purple-700' : 'text-emerald-600 hover:text-emerald-700'
              }`}
            >
              Back to job search
            </button>
            <button
              onClick={loadJob}
              className={`px-4 py-2 text-white rounded-lg ${
                currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <button
            onClick={() => navigate('/jobs')}
            className={`font-medium ${
              currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:text-blue-700' : 
              currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:text-purple-700' : 'text-emerald-600 hover:text-emerald-700'
            }`}
          >
            Back to job search
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: '/jobs' },
    { label: job.title }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to jobs</span>
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className={`text-white p-6 md:p-8 ${
            currentBrand.colors.primary === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 
            currentBrand.colors.primary === 'purple' ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
          }`}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <CompanyLogo name={job.company} className="w-12 h-12" />
                  <div>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-2">
                      {job.department}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${
                  currentBrand.colors.primary === 'blue' ? 'text-blue-100' : 
                  currentBrand.colors.primary === 'purple' ? 'text-purple-100' : 'text-emerald-100'
                }`}>
                  <Building2 className="w-5 h-5" />
                  <span className="text-lg">{job.company}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSaveJob}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isSaved 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Job'}
                </button>
                <button
                  onClick={() => hasApplied ? null : setIsApplicationModalOpen(true)}
                  disabled={hasApplied}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    hasApplied 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed flex items-center gap-2'
                      : `bg-white ${
                          currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:bg-blue-50' : 
                          currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:bg-purple-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Applied
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{job.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Employment Type</p>
                  <p className="font-semibold text-gray-900">{job.type}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Salary Range</p>
                  <p className="font-semibold text-green-600">
                    {formatSalary(job.salary.min, job.salary.max)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Posted Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(job.postedDate)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About This Role</h2>
                  <p className="text-gray-600 leading-relaxed">{job.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className={`block w-1.5 h-1.5 rounded-full mt-2 ${
                          currentBrand.colors.primary === 'blue' ? 'bg-blue-600' : 
                          currentBrand.colors.primary === 'purple' ? 'bg-purple-600' : 'bg-emerald-600'
                        }`}></span>
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {job.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Company Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <CompanyLogo name={job.company} className="w-12 h-12" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.company}</h3>
                      <p className="text-sm text-gray-600">{job.companyInfo.industry}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{job.companyInfo.size}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Founded {job.companyInfo.founded}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a 
                        href={job.companyInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-sm flex items-center gap-1 ${
                          currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:text-blue-700' : 
                          currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:text-purple-700' : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {job.companyInfo.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => hasApplied ? null : setIsApplicationModalOpen(true)}
                    disabled={hasApplied}
                    className={`w-full px-6 py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      hasApplied 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : `text-white ${
                            currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                            currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
                          }`
                    }`}
                  >
                    {hasApplied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Applied
                      </>
                    ) : (
                      'Apply for This Position'
                    )}
                  </button>
                  <button
                    onClick={handleSaveJob}
                    className={`w-full px-6 py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isSaved 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Remove from Saved' : 'Save for Later'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplicationModal
        job={job}
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onApplicationSubmitted={() => {
          setHasApplied(true);
          // Optionally refresh the job data
          loadJob();
        }}
      />
    </div>
  );
}