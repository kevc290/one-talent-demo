import type { User, LoginCredentials, RegisterCredentials, Application, UserProfile } from '../types/auth';
import type { ParsedResumeData } from './resumeParser';

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format',
    joinedDate: '2024-01-15'
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format',
    joinedDate: '2024-02-20'
  }
];

// Mock applications data
const MOCK_APPLICATIONS: Application[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    appliedDate: '2025-08-30',
    status: 'pending'
  },
  {
    id: '2',
    jobId: '3',
    jobTitle: 'DevOps Engineer',
    company: 'CloudScale Inc',
    appliedDate: '2025-08-28',
    status: 'interview'
  },
  {
    id: '3',
    jobId: '5',
    jobTitle: 'Backend Software Engineer',
    company: 'DataFlow Systems',
    appliedDate: '2025-08-25',
    status: 'reviewed'
  }
];

const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'currentUser';
const APPLICATIONS_KEY = 'userApplications';

export const mockAuth = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // For demo purposes, accept any password for existing users
    // In a real app, you'd verify the password hash
    if (credentials.password.length < 6) {
      throw new Error('Invalid password');
    }

    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    // Store token and user data
    if (credentials.rememberMe) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { user, token };
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === credentials.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const newUser: User = {
      id: (MOCK_USERS.length + 1).toString(),
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format`,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    MOCK_USERS.push(newUser);
    
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    return { user: newUser, token };
  },

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Mock applications management
  getUserApplications(userId: string): Application[] {
    try {
      const stored = localStorage.getItem(`${APPLICATIONS_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : MOCK_APPLICATIONS;
    } catch {
      return MOCK_APPLICATIONS;
    }
  },

  addApplication(userId: string, application: Omit<Application, 'id'>): Application {
    const applications = this.getUserApplications(userId);
    const newApplication: Application = {
      ...application,
      id: (applications.length + 1).toString()
    };
    
    applications.push(newApplication);
    localStorage.setItem(`${APPLICATIONS_KEY}_${userId}`, JSON.stringify(applications));
    
    return newApplication;
  },

  updateApplicationStatus(userId: string, applicationId: string, status: Application['status']): void {
    const applications = this.getUserApplications(userId);
    const appIndex = applications.findIndex(app => app.id === applicationId);
    
    if (appIndex !== -1) {
      applications[appIndex].status = status;
      localStorage.setItem(`${APPLICATIONS_KEY}_${userId}`, JSON.stringify(applications));
    }
  },

  // Profile management
  updateUserProfile(userId: string, profileData: Partial<UserProfile>, resumeFileName?: string): User | null {
    const userIndex = MOCK_USERS.findIndex(user => user.id === userId);
    if (userIndex === -1) return null;

    const updatedProfile: UserProfile = {
      ...MOCK_USERS[userIndex].profile,
      ...profileData,
      resumeFileName,
      resumeUploadDate: resumeFileName ? new Date().toISOString() : MOCK_USERS[userIndex].profile?.resumeUploadDate
    };

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      profile: updatedProfile
    };

    // Update stored user data
    localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USERS[userIndex]));
    
    return MOCK_USERS[userIndex];
  },

  updateProfileFromResume(userId: string, parsedData: ParsedResumeData, resumeFileName: string): User | null {
    const profileUpdate: Partial<UserProfile> = {
      phone: parsedData.phone,
      skills: parsedData.skills,
      experience: parsedData.experience,
      education: parsedData.education,
      summary: parsedData.summary
    };

    // Update user's name if found in resume and not already set properly
    const userIndex = MOCK_USERS.findIndex(user => user.id === userId);
    if (userIndex !== -1 && parsedData.fullName) {
      const nameParts = parsedData.fullName.split(' ');
      if (nameParts.length >= 2) {
        MOCK_USERS[userIndex].firstName = nameParts[0];
        MOCK_USERS[userIndex].lastName = nameParts.slice(1).join(' ');
      }
    }

    return this.updateUserProfile(userId, profileUpdate, resumeFileName);
  },

  getUserProfile(userId: string): UserProfile | null {
    const user = MOCK_USERS.find(u => u.id === userId);
    return user?.profile || null;
  }
};