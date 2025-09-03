import { apiClient } from './api';
import type { ApiResponse } from './api';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  type: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  appliedDate: string;
  coverLetter?: string;
  resumeFilename?: string;
  notes?: string;
}

export interface SubmitApplicationData {
  jobId: string;
  coverLetter: string;
  resumeFilename?: string;
}

export const applicationsService = {
  async getUserApplications(): Promise<Application[]> {
    const response = await apiClient.get<Application[]>('/applications');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch applications');
    }

    return response.data;
  },

  async submitApplication(applicationData: SubmitApplicationData): Promise<{ id: string; appliedDate: string }> {
    const response = await apiClient.post<{ id: string; appliedDate: string; message: string }>('/applications', applicationData);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to submit application');
    }

    return response.data;
  },

  // Helper method for backward compatibility during migration
  addApplicationLocally(userId: string, application: Omit<Application, 'id'>): Application {
    try {
      const applications = this.getUserApplicationsLocally(userId);
      const newApplication: Application = {
        ...application,
        id: (applications.length + 1).toString(),
      };
      
      applications.push(newApplication);
      localStorage.setItem(`userApplications_${userId}`, JSON.stringify(applications));
      
      return newApplication;
    } catch (error) {
      console.error('Failed to add application locally:', error);
      throw error;
    }
  },

  getUserApplicationsLocally(userId: string): Application[] {
    try {
      const stored = localStorage.getItem(`userApplications_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
};