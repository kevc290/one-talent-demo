import { apiClient } from './api';
import type { ApiResponse, PaginatedResponse } from './api';
import type { Job } from '../data/jobs';
import { jobs } from '../data/jobs';

// Check if we're in demo mode
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export interface JobFilters {
  search?: string;
  type?: string[];
  remote?: boolean;
  location?: string;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  company?: string;
  postedWithin?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface JobsQueryParams extends JobFilters, PaginationOptions {}

export const jobsService = {
  async getJobs(params?: JobsQueryParams): Promise<PaginatedResponse<Job>> {
    if (isDemoMode) {
      // Return mock data in demo mode
      let filteredJobs = [...jobs];
      
      // Apply search filter
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(search) ||
          job.company.toLowerCase().includes(search) ||
          job.location.toLowerCase().includes(search) ||
          job.description.toLowerCase().includes(search)
        );
      }
      
      // Apply type filter
      if (params?.type && params.type.length > 0) {
        filteredJobs = filteredJobs.filter(job => params.type!.includes(job.type));
      }
      
      // Apply remote filter
      if (params?.remote) {
        filteredJobs = filteredJobs.filter(job => job.remote || job.type === 'Remote');
      }
      
      // Apply department filter
      if (params?.department) {
        filteredJobs = filteredJobs.filter(job => job.department === params.department);
      }
      
      // Apply salary filters
      if (params?.salaryMin) {
        filteredJobs = filteredJobs.filter(job => job.salary.max >= params.salaryMin!);
      }
      if (params?.salaryMax) {
        filteredJobs = filteredJobs.filter(job => job.salary.min <= params.salaryMax!);
      }
      
      // Apply company filter
      if (params?.company) {
        filteredJobs = filteredJobs.filter(job => job.company.toLowerCase().includes(params.company!.toLowerCase()));
      }
      
      // Apply pagination
      const limit = params?.limit || 50;
      const page = params?.page || 1;
      const offset = (page - 1) * limit;
      const paginatedJobs = filteredJobs.slice(offset, offset + limit);
      
      return {
        data: paginatedJobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredJobs.length / limit),
          totalItems: filteredJobs.length,
          itemsPerPage: limit,
          hasNext: page < Math.ceil(filteredJobs.length / limit),
          hasPrevious: page > 1
        }
      };
    }

    const response = await apiClient.get<PaginatedResponse<Job>>('/jobs', params);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch jobs');
    }

    return response.data;
  },

  async getJobById(id: string): Promise<Job> {
    if (isDemoMode) {
      const job = jobs.find(j => j.id === id);
      if (!job) {
        throw new Error('Job not found');
      }
      return job;
    }

    const response = await apiClient.get<Job>(`/jobs/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Job not found');
    }

    return response.data;
  },

  async getSavedJobs(): Promise<Job[]> {
    if (isDemoMode) {
      try {
        const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        return jobs.filter(job => savedJobIds.includes(job.id));
      } catch {
        return [];
      }
    }

    const response = await apiClient.get<Job[]>('/jobs/saved');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch saved jobs');
    }

    return response.data;
  },

  async saveJob(jobId: string): Promise<void> {
    if (isDemoMode) {
      this.saveJobLocally(jobId);
      return;
    }

    const response = await apiClient.post<{ message: string }>('/jobs/save', { jobId });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to save job');
    }
  },

  async unsaveJob(jobId: string): Promise<void> {
    if (isDemoMode) {
      this.unsaveJobLocally(jobId);
      return;
    }

    const response = await apiClient.delete<{ message: string }>(`/jobs/save/${jobId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to remove saved job');
    }
  },

  // Helper methods to maintain compatibility with existing code
  isJobSaved(jobId: string): boolean {
    try {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      return savedJobs.includes(jobId);
    } catch {
      return false;
    }
  },

  // Local storage methods for backward compatibility during migration
  saveJobLocally(jobId: string): void {
    try {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      if (!savedJobs.includes(jobId)) {
        savedJobs.push(jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      }
    } catch (error) {
      console.error('Failed to save job locally:', error);
    }
  },

  unsaveJobLocally(jobId: string): void {
    try {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const updatedJobs = savedJobs.filter((id: string) => id !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
    } catch (error) {
      console.error('Failed to remove saved job locally:', error);
    }
  },
};