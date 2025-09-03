export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  phone?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
  summary?: string;
  resume_filename?: string;
  resume_upload_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  remote: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  salary_min: number;
  salary_max: number;
  posted_date: Date;
  expires_date?: Date;
  is_active: boolean;
  company_info?: CompanyInfo;
  created_at: Date;
  updated_at: Date;
}

export interface CompanyInfo {
  id: string;
  name: string;
  industry: string;
  size: string;
  founded: number;
  website: string;
  description: string;
  logo?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  applied_date: Date;
  cover_letter?: string;
  resume_filename?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  saved_date: Date;
}

// Auth types
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
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Query types
export interface JobFilters {
  search?: string;
  type?: string[];
  remote?: boolean;
  location?: string;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  company?: string;
  postedWithin?: number; // days
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}