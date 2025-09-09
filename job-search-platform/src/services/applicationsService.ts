import { apiClient, isDemoMode } from './api';
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
    try {
      if (isDemoMode) {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return [];
        const user = JSON.parse(currentUser);
        return this.getUserApplicationsLocally(user.id);
      }

      const response = await apiClient.get<Application[]>('/applications');
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch applications');
      }
      return response.data;
    } catch (error) {
      // Fallback to local storage in case of network/CORS/API errors
      try {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return [];
        const user = JSON.parse(currentUser);
        return this.getUserApplicationsLocally(user.id);
      } catch {
        return [];
      }
    }
  },

  async submitApplication(applicationData: SubmitApplicationData): Promise<{ id: string; appliedDate: string }> {
    if (isDemoMode) {
      // In demo mode, simulate application submission
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      const user = JSON.parse(currentUser);
      const newApplication: Omit<Application, 'id'> = {
        ...applicationData,
        jobTitle: 'Mock Job Title', // Would get from job data in real implementation
        company: 'Mock Company',
        location: 'Mock Location',
        type: 'Full-time',
        status: 'pending',
        appliedDate: new Date().toISOString().split('T')[0],
      };
      
      const application = this.addApplicationLocally(user.id, newApplication);
      return { id: application.id, appliedDate: application.appliedDate };
    }

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
      const apps: Application[] = stored ? JSON.parse(stored) : [];
      // Normalize appliedDate to full ISO if stored as date-only
      const normalized = apps.map(app => ({
        ...app,
        appliedDate: app.appliedDate.length === 10
          ? new Date(app.appliedDate + 'T00:00:00.000Z').toISOString()
          : app.appliedDate
      }));
      // Newest first by exact timestamp
      return normalized.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
    } catch {
      return [];
    }
  },
};