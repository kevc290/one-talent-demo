import { apiClient } from './api';
import type { ApiResponse, PaginatedResponse } from './api';
import type { Job } from '../data/jobs';

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
    const response = await apiClient.get<PaginatedResponse<Job>>('/jobs', params);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch jobs');
    }

    return response.data;
  },

  async getJobById(id: string): Promise<Job> {
    const response = await apiClient.get<Job>(`/jobs/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Job not found');
    }

    return response.data;
  },

  async getSavedJobs(): Promise<Job[]> {
    const response = await apiClient.get<Job[]>('/jobs/saved');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch saved jobs');
    }

    return response.data;
  },

  async saveJob(jobId: string): Promise<void> {
    const response = await apiClient.post<{ message: string }>('/jobs/save', { jobId });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to save job');
    }
  },

  async unsaveJob(jobId: string): Promise<void> {
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