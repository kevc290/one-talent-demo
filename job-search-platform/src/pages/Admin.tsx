import { useState } from 'react';
import { BarChart3, Users, Briefcase, Plus, Settings, Eye, EyeOff, Trash2, Edit } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/ThemeContext';

export function Admin() {
  const [activeTab, setActiveTab] = useState('analytics');
  const { currentBrand } = useTheme();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin' }
  ];

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'jobs', label: 'Job Management', icon: Briefcase },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  const getButtonClasses = (variant: 'primary' | 'secondary' | 'danger' = 'primary') => {
    if (variant === 'danger') {
      return 'bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors';
    }
    if (variant === 'secondary') {
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors';
    }
    
    const primaryColors = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      emerald: 'bg-emerald-600 hover:bg-emerald-700'
    };
    
    return `${primaryColors[currentBrand.colors.primary]} text-white px-4 py-2 rounded-lg font-medium transition-colors`;
  };

  const getTabClasses = (tabId: string) => {
    const isActive = activeTab === tabId;
    const activeColors = {
      blue: 'border-blue-500 text-blue-600',
      purple: 'border-purple-500 text-purple-600', 
      emerald: 'border-emerald-500 text-emerald-600'
    };
    
    return `flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${
      isActive 
        ? activeColors[currentBrand.colors.primary]
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage jobs, users, and monitor platform analytics
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={getTabClasses(id)}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'jobs' && <JobManagementTab getButtonClasses={getButtonClasses} />}
        {activeTab === 'users' && <UserManagementTab getButtonClasses={getButtonClasses} />}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const mockAnalytics = {
    totalUsers: 1247,
    totalJobs: 89,
    totalApplications: 523,
    activeUsers: 89,
  };

  const mockChartData = [
    { month: 'Jan', users: 45, jobs: 12, applications: 67 },
    { month: 'Feb', users: 52, jobs: 18, applications: 89 },
    { month: 'Mar', users: 78, jobs: 25, applications: 124 },
    { month: 'Apr', users: 94, jobs: 31, applications: 167 },
    { month: 'May', users: 123, jobs: 28, applications: 203 },
    { month: 'Jun', users: 142, jobs: 34, applications: 245 },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalJobs}</p>
            </div>
            <Briefcase className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalApplications}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{mockAnalytics.activeUsers}</p>
            </div>
            <Eye className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Chart Mockup */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Growth</h3>
        <div className="space-y-4">
          {mockChartData.map((data, index) => (
            <div key={data.month} className="flex items-center gap-4">
              <div className="w-8 text-sm font-medium text-gray-600">{data.month}</div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(data.users / 150) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 min-w-8">{data.users}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TabProps {
  getButtonClasses: (variant?: 'primary' | 'secondary' | 'danger') => string;
}

function JobManagementTab({ getButtonClasses }: TabProps) {
  const [showForm, setShowForm] = useState(false);

  const mockJobs = [
    { id: 1, title: 'Senior React Developer', company: 'Tech Corp', status: 'active', applications: 23 },
    { id: 2, title: 'UX Designer', company: 'Design Studio', status: 'active', applications: 15 },
    { id: 3, title: 'Backend Engineer', company: 'StartupXYZ', status: 'paused', applications: 8 },
    { id: 4, title: 'Product Manager', company: 'Innovation Inc', status: 'active', applications: 31 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Job Listings</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className={getButtonClasses('primary')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Job
        </button>
      </div>

      {/* Job Posting Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Create New Job Posting</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Job Title"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company Name"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Location"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Job Type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>
            <div className="md:col-span-2">
              <textarea
                placeholder="Job Description"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className={getButtonClasses('primary')}>Create Job</button>
            <button 
              onClick={() => setShowForm(false)}
              className={getButtonClasses('secondary')}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockJobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      job.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.applications}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserManagementTab({ getButtonClasses }: TabProps) {
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'active', joinDate: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'User', status: 'inactive', joinDate: '2024-03-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button className={getButtonClasses('primary')}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}