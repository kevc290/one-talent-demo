import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Briefcase, 
  Heart, 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  DollarSign,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { SearchBar } from '../components/SearchBar';
import { jobsService } from '../services/jobsService';
import { applicationsService } from '../services/applicationsService';
import type { Job } from '../data/jobs';
import type { Application } from '../services/applicationsService';

export function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { currentBrand } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedJobsCount, setSavedJobsCount] = useState(0);

  const loadDashboardData = async () => {
    // Only load data if user is authenticated
    if (!user || !isAuthenticated || authLoading) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Load saved jobs and applications in parallel
      const [savedJobsData, applicationsData] = await Promise.all([
        jobsService.getSavedJobs().catch(() => []), // Fallback to empty array on error
        applicationsService.getUserApplications().catch(() => []) // Fallback to empty array on error
      ]);
      
      setSavedJobs(savedJobsData);
      setSavedJobsCount(savedJobsData.length);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Fallback to empty states
      setSavedJobs([]);
      setSavedJobsCount(0);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Don't do anything if auth is still loading
    if (authLoading) {
      return;
    }
    
    // Only load dashboard data when user is authenticated
    if (isAuthenticated && user) {
      loadDashboardData();
    } else {
      // Set loading to false if user is not authenticated
      setIsLoading(false);
    }
  }, [user, isAuthenticated, authLoading]);

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'reviewed':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'interview':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'reviewed':
        return 'text-blue-600 bg-blue-50';
      case 'interview':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'accepted':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard' }
  ];

  // Show loading spinner while auth or dashboard data is loading
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated (ProtectedRoute should handle this)
  if (!isAuthenticated || !user) {
    console.warn('Dashboard: User not authenticated, should not reach this point');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Track your job applications and discover new opportunities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${
            currentBrand.colors.primary === 'blue' ? 'border-blue-500' : 
            currentBrand.colors.primary === 'purple' ? 'border-purple-500' : 'border-emerald-500'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Saved Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{savedJobsCount}</p>
              </div>
              <Heart className={`w-8 h-8 ${
                currentBrand.colors.primary === 'blue' ? 'text-blue-500' : 
                currentBrand.colors.primary === 'purple' ? 'text-purple-500' : 'text-emerald-500'
              }`} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <User className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Applications
                </h2>
                <Link
                  to="/applications"
                  className={`text-sm font-medium flex items-center gap-1 ${
                    currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:text-blue-700' : 
                    currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:text-purple-700' : 'text-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  View All <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here</p>
                  <Link
                    to="/jobs"
                    className={`inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors ${
                      currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                      currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    Browse Jobs <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{application.jobTitle}</h3>
                          <p className="text-sm text-gray-600 mb-2">{application.company}</p>
                          <p className="text-xs text-gray-500">Applied on {formatDate(application.appliedDate)}</p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Jobs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Saved Jobs
                </h2>
                <Link
                  to="/saved-jobs"
                  className={`text-sm font-medium flex items-center gap-1 ${
                    currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:text-blue-700' : 
                    currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:text-purple-700' : 'text-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  View All <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {savedJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
                  <p className="text-gray-600 mb-4">Save jobs you're interested in to view them here</p>
                  <Link
                    to="/jobs"
                    className={`inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors ${
                      currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                      currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    Browse Jobs <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedJobs.slice(0, 3).map((job) => (
                    <Link
                      key={job.id}
                      to={`/job/${job.id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600">
                          {job.company.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 truncate">{job.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{user.firstName} {user.lastName}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                Joined {formatDate(user.joinedDate)}
              </div>
              <Link
                to="/profile"
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center block"
              >
                Edit Profile
              </Link>
            </div>

            {/* Quick Job Search */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Job Search</h3>
              <div className="mb-4">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                />
              </div>
              <Link
                to={searchTerm ? `/jobs?search=${encodeURIComponent(searchTerm)}` : '/jobs'}
                className={`w-full text-white py-2 px-4 rounded-lg transition-colors text-center block ${
                  currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                  currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Search Jobs
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link
                  to="/jobs"
                  className={`flex items-center gap-3 text-gray-700 transition-colors ${
                    currentBrand.colors.primary === 'blue' ? 'hover:text-blue-600' : 
                    currentBrand.colors.primary === 'purple' ? 'hover:text-purple-600' : 'hover:text-emerald-600'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Browse All Jobs
                </Link>
                <Link
                  to="/saved-jobs"
                  className={`flex items-center gap-3 text-gray-700 transition-colors ${
                    currentBrand.colors.primary === 'blue' ? 'hover:text-blue-600' : 
                    currentBrand.colors.primary === 'purple' ? 'hover:text-purple-600' : 'hover:text-emerald-600'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Saved Jobs
                </Link>
                <Link
                  to="/applications"
                  className={`flex items-center gap-3 text-gray-700 transition-colors ${
                    currentBrand.colors.primary === 'blue' ? 'hover:text-blue-600' : 
                    currentBrand.colors.primary === 'purple' ? 'hover:text-purple-600' : 'hover:text-emerald-600'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Applications
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center gap-3 text-gray-700 transition-colors ${
                    currentBrand.colors.primary === 'blue' ? 'hover:text-blue-600' : 
                    currentBrand.colors.primary === 'purple' ? 'hover:text-purple-600' : 'hover:text-emerald-600'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}