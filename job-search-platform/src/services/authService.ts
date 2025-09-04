import { apiClient } from './api';
import type { ApiResponse } from './api';
import type { User, LoginCredentials, RegisterCredentials, UserProfile } from '../types/auth';
import type { ParsedResumeData } from '../utils/resumeParser';

// Check if we're in demo mode
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

// Mock user data for demo mode
const mockUser: User = {
  id: 'demo-user-1',
  email: 'demo@jobsearchpro.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
  joinedDate: new Date().toISOString(),
  profile: {
    phone: '(555) 123-4567',
    summary: 'Experienced full-stack developer with expertise in React and Node.js',
    experience: ['Senior Software Engineer at TechCorp (2020-2025)', 'Full Stack Developer at StartupCo (2018-2020)'],
    education: ['BS Computer Science - Stanford University (2018)'],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
    resumeFileName: 'john-doe-resume.pdf'
  }
};

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (isDemoMode) {
      // Simulate a short delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Accept any email/password for demo
      const mockResponse: AuthResponse = {
        user: mockUser,
        token: 'demo-jwt-token-' + Date.now()
      };

      // Store token based on rememberMe preference
      if (credentials.rememberMe) {
        localStorage.setItem('authToken', mockResponse.token);
      } else {
        sessionStorage.setItem('authToken', mockResponse.token);
      }
      
      localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
      
      return mockResponse;
    }

    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed');
    }

    // Store token based on rememberMe preference
    if (credentials.rememberMe) {
      localStorage.setItem('authToken', response.data.token);
    } else {
      sessionStorage.setItem('authToken', response.data.token);
    }
    
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    if (isDemoMode) {
      // Simulate a short delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a user from registration data
      const registeredUser: User = {
        ...mockUser,
        id: 'demo-user-' + Date.now(),
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
      };

      const mockResponse: AuthResponse = {
        user: registeredUser,
        token: 'demo-jwt-token-' + Date.now()
      };

      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
      
      return mockResponse;
    }

    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Registration failed');
    }

    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async getProfile(): Promise<User> {
    if (isDemoMode) {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      return currentUser;
    }

    const response = await apiClient.get<User>('/auth/profile');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get profile');
    }

    localStorage.setItem('currentUser', JSON.stringify(response.data));
    
    return response.data;
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<void> {
    if (isDemoMode) {
      // Update localStorage user data
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const updatedUser = {
        ...currentUser,
        profile: { ...currentUser.profile, ...profileData }
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return;
    }

    const response = await apiClient.put<{ message: string }>('/auth/profile', profileData);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update profile');
    }

    // Refresh user data
    await this.getProfile();
  },

  async updateProfileFromResume(parsedData: ParsedResumeData, resumeFileName: string): Promise<void> {
    if (isDemoMode) {
      // Update localStorage user data with resume data
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const updatedUser = {
        ...currentUser,
        profile: { 
          ...currentUser.profile, 
          phone: parsedData.phone || currentUser.profile?.phone,
          summary: parsedData.summary || currentUser.profile?.summary,
          skills: parsedData.skills || currentUser.profile?.skills,
          experience: parsedData.experience || currentUser.profile?.experience,
          education: parsedData.education || currentUser.profile?.education,
          resumeFileName
        }
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return;
    }

    const response = await apiClient.post<{ message: string }>('/auth/profile/resume', {
      ...parsedData,
      resumeFileName,
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update profile from resume');
    }

    // Refresh user data
    await this.getProfile();
  },

  logout(): void {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }
      
      if (isDemoMode) {
        // In demo mode, just check if we have a user
        return !!this.getCurrentUser();
      }
      
      // Try to get profile to validate token
      await this.getProfile();
      return true;
    } catch (error) {
      console.warn('Token validation failed:', error);
      // Clear invalid token and user data
      this.logout();
      return false;
    }
  },
};