export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  joinedDate: string;
  createdAt?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  phone?: string;
  location?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
  summary?: string;
  linkedin?: string;
  portfolio?: string;
  resumeFileName?: string;
  resumeUploadDate?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
}