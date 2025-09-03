import { apiClient } from './api';
import type { ApiResponse } from './api';
import type { User, LoginCredentials, RegisterCredentials, UserProfile } from '../types/auth';
import type { ParsedResumeData } from '../utils/resumeParser';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
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
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Registration failed');
    }

    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get profile');
    }

    localStorage.setItem('currentUser', JSON.stringify(response.data));
    
    return response.data;
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<void> {
    const response = await apiClient.put<{ message: string }>('/auth/profile', profileData);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update profile');
    }

    // Refresh user data
    await this.getProfile();
  },

  async updateProfileFromResume(parsedData: ParsedResumeData, resumeFileName: string): Promise<void> {
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