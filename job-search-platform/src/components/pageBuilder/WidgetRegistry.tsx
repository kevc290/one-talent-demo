import { 
  Image, 
  Type, 
  BarChart3, 
  Link as LinkIcon, 
  Heart,
  FileText,
  User,
  Calendar,
  Briefcase,
  ExternalLink,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { WidgetDefinition } from '../../types/pageBuilder';
import { HubSpotBannerWidget } from './widgets/HubSpotBannerWidget';
import { HubSpotCardWidget } from './widgets/HubSpotCardWidget';
import { StatCardWidget } from './widgets/StatCardWidget';
import { QuickLinksWidget } from './widgets/QuickLinksWidget';
import { applicationsService } from '../../services/applicationsService';
import { jobsService } from '../../services/jobsService';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { Application } from '../../types/auth';
import type { Job } from '../../data/jobs';

// Real widget implementations with data
function SavedJobsWidget({ isEditing }: { isEditing?: boolean }) {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentBrand } = useTheme();

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const jobs = await jobsService.getSavedJobs();
        setSavedJobs(jobs);
      } catch (error) {
        console.error('Failed to load saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Saved Jobs
        </h2>
        {!isEditing && (
          <Link
            to="/saved-jobs"
            className={`text-sm font-medium flex items-center gap-1 ${
              currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:text-blue-700' : 
              currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:text-purple-700' : 
              currentBrand.colors.primary === 'emerald' ? 'text-emerald-600 hover:text-emerald-700' :
              'text-gray-600 hover:text-gray-700'
            }`}
          >
            View All <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {savedJobs.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
            <p className="text-gray-600 mb-4">Save jobs you're interested in to view them here</p>
            {!isEditing && (
              <Link
                to="/jobs"
                className={`inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors ${
                  currentBrand.id === 'kelly' ? 'bg-green-600 hover:bg-green-700' :
                  currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                  currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 
                  currentBrand.colors.primary === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                Browse Jobs <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.slice(0, 3).map((job) => (
              <Link
                key={job.id}
                to={isEditing ? '#' : `/job/${job.id}`}
                className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                onClick={(e) => isEditing && e.preventDefault()}
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
  );
}

function RecentApplicationsWidget({ isEditing }: { isEditing?: boolean }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentBrand } = useTheme();

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const apps = await applicationsService.getUserApplications();
        setApplications(apps);
      } catch (error) {
        console.error('Failed to load applications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'reviewed':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'interview':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'reviewed':
        return <FileText className="w-3 h-3" />;
      case 'interview':
        return <User className="w-3 h-3" />;
      case 'accepted':
        return <CheckCircle className="w-3 h-3" />;
      case 'rejected':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Recent Applications
        </h2>
        {!isEditing && (
          <Link
            to="/applications"
            className={`text-sm font-medium flex items-center gap-1 ${
              currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:text-blue-700' : 
              currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:text-purple-700' : 
              currentBrand.colors.primary === 'emerald' ? 'text-emerald-600 hover:text-emerald-700' :
              'text-gray-600 hover:text-gray-700'
            }`}
          >
            View All <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here</p>
            {!isEditing && (
              <Link
                to="/jobs"
                className={`inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors ${
                  currentBrand.id === 'kelly' ? 'bg-green-600 hover:bg-green-700' :
                  currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                  currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 
                  currentBrand.colors.primary === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                Browse Jobs <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 3).map((application) => (
              <div 
                key={application.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
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
    </div>
  );
}

function ProfileOverviewWidget({ isEditing }: { isEditing?: boolean }) {
  const { user } = useAuth();
  
  const formatMemberDate = () => {
    const dateString = user?.createdAt || user?.joinedDate;
    if (!dateString) return 'Recently joined';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h3>
      <div className="flex items-center gap-4 mb-4">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div>
          <h4 className="font-medium text-gray-900">
            {user?.firstName} {user?.lastName}
          </h4>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Calendar className="w-4 h-4" />
        Member since {formatMemberDate()}
      </div>
      {!isEditing && (
        <Link
          to="/profile"
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center inline-block mt-auto"
        >
          Edit Profile
        </Link>
      )}
    </div>
  );
}

export const widgetRegistry: Record<string, WidgetDefinition> = {
  'hubspot-banner': {
    type: 'hubspot-banner',
    name: 'Content Banner',
    description: 'Display banner content from your content library',
    icon: Image,
    defaultSize: { w: 32, h: 6 }, // Full width in 48-column grid
    minSize: { w: 16, h: 4 },
    maxSize: { w: 48, h: 8 },
    component: HubSpotBannerWidget,
  },
  'hubspot-card': {
    type: 'hubspot-card',
    name: 'Content Card',
    description: 'Display card content from your content library',
    icon: Type,
    defaultSize: { w: 12, h: 8 }, // Compact card size
    minSize: { w: 8, h: 6 },
    maxSize: { w: 24, h: 12 },
    component: HubSpotCardWidget,
  },
  'stat-card': {
    type: 'stat-card',
    name: 'Statistics Card',
    description: 'Display key metrics and numbers',
    icon: BarChart3,
    defaultSize: { w: 12, h: 4 }, // Compact stat card
    minSize: { w: 8, h: 3 },
    maxSize: { w: 16, h: 6 },
    component: StatCardWidget,
  },
  'quick-links': {
    type: 'quick-links',
    name: 'Quick Links',
    description: 'Navigation shortcuts for users',
    icon: LinkIcon,
    defaultSize: { w: 12, h: 8 },
    minSize: { w: 8, h: 6 },
    maxSize: { w: 16, h: 12 },
    component: QuickLinksWidget,
  },
  'saved-jobs': {
    type: 'saved-jobs',
    name: 'Saved Jobs',
    description: 'Display user\'s saved job listings',
    icon: Heart,
    defaultSize: { w: 24, h: 12 }, // Medium-large widget
    minSize: { w: 16, h: 8 },
    maxSize: { w: 32, h: 16 },
    component: SavedJobsWidget,
  },
  'recent-applications': {
    type: 'recent-applications',
    name: 'Recent Applications',
    description: 'Show user\'s recent job applications',
    icon: FileText,
    defaultSize: { w: 24, h: 12 }, // Medium-large widget
    minSize: { w: 16, h: 8 },
    maxSize: { w: 32, h: 16 },
    component: RecentApplicationsWidget,
  },
  'profile-overview': {
    type: 'profile-overview',
    name: 'Profile Overview',
    description: 'User profile summary and quick actions',
    icon: User,
    defaultSize: { w: 12, h: 10 },
    minSize: { w: 8, h: 8 },
    maxSize: { w: 16, h: 12 },
    component: ProfileOverviewWidget,
  },
};

export function getWidgetDefinition(type: string): WidgetDefinition | undefined {
  return widgetRegistry[type];
}

export function getAllWidgetTypes(): WidgetDefinition[] {
  return Object.values(widgetRegistry);
}