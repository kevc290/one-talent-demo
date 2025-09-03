// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response, endpoint: string = ''): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        // For login/register endpoints, don't clear tokens or redirect
        // These are expected failures with invalid credentials
        const isLoginRegisterEndpoint = endpoint === '/auth/login' || endpoint === '/auth/register';
        
        if (isLoginRegisterEndpoint) {
          console.warn('401 Unauthorized - invalid credentials');
          throw new Error(data.message || 'Invalid credentials');
        }
        
        // For all other endpoints (including protected auth endpoints), clear invalid tokens and redirect
        console.warn('401 Unauthorized - clearing invalid tokens');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        
        // Redirect to login if on a protected route
        const currentPath = window.location.pathname;
        const protectedRoutes = ['/dashboard', '/saved-jobs', '/applications', '/profile'];
        if (protectedRoutes.includes(currentPath)) {
          window.location.href = '/login?redirect=' + encodeURIComponent(currentPath);
        }
      }
      
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          if (Array.isArray(params[key])) {
            params[key].forEach((value: any) => url.searchParams.append(key, value));
          } else {
            url.searchParams.append(key, params[key].toString());
          }
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response, endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response, endpoint);
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response, endpoint);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response, endpoint);
  }
}

export const apiClient = new ApiClient();