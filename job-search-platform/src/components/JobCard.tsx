import { MapPin, DollarSign, Building2, Calendar } from 'lucide-react';
import type { Job } from '../data/jobs';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  view: 'grid' | 'list';
}

export function JobCard({ job, view }: JobCardProps) {
  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
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
      <Link 
        to={`/job/${job.id}`}
        className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {job.type}
              </span>
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
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <DollarSign className="w-5 h-5" />
            {formatSalary(job.salary.min, job.salary.max)}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/job/${job.id}`}
      className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 h-full"
    >
      <div className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{job.title}</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap ml-2">
            {job.type}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
          <Building2 className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{job.company}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{job.description}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
          <DollarSign className="w-4 h-4" />
          {formatSalary(job.salary.min, job.salary.max)}
        </div>
        <span className="text-xs text-gray-500">{formatDate(job.postedDate)}</span>
      </div>
    </Link>
  );
}