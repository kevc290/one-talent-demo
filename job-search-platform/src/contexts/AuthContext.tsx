import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { AuthState, User, LoginCredentials, RegisterCredentials, UserProfile } from '../types/auth';
import { authService } from '../services/authService';
import type { ParsedResumeData } from '../utils/resumeParser';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<UserProfile>, resumeFileName?: string) => Promise<User | null>;
  updateProfileFromResume: (parsedData: ParsedResumeData, resumeFileName: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'INITIALIZE':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Initialize auth state and validate token
    const initializeAuth = async () => {
      const user = authService.getCurrentUser();
      const hasLocalAuth = authService.isAuthenticated();
      
      if (hasLocalAuth && user) {
        // Validate the token with the backend
        const isValid = await authService.validateToken();
        if (isValid) {
          dispatch({ type: 'INITIALIZE', payload: user });
        } else {
          dispatch({ type: 'INITIALIZE', payload: null });
        }
      } else {
        dispatch({ type: 'INITIALIZE', payload: null });
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user } = await authService.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user } = await authService.register(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (profileData: Partial<UserProfile>, resumeFileName?: string): Promise<User | null> => {
    if (!state.user) return null;
    
    try {
      await authService.updateProfile(profileData);
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) {
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
      return updatedUser;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return null;
    }
  };

  const updateProfileFromResume = async (parsedData: ParsedResumeData, resumeFileName: string): Promise<User | null> => {
    if (!state.user) return null;
    
    try {
      await authService.updateProfileFromResume(parsedData, resumeFileName);
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) {
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
      return updatedUser;
    } catch (error) {
      console.error('Failed to update profile from resume:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    updateProfileFromResume,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}