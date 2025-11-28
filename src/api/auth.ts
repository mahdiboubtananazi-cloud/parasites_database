import apiClient, { handleApiError } from './client';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
  createdAt?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

const isDevelopment = !import.meta.env.VITE_API_URL;

// Mock users for development
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Dr. Ahmed',
    email: 'ahmed@university.edu',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Dr. Fatima',
    email: 'fatima@university.edu',
    role: 'professor',
  },
];

export const authApi = {
  // Login
  login: async (data: LoginDto): Promise<AuthResponse> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simple mock validation
        if (!data.email || !data.password || data.password.length < 6) {
          throw new Error('Invalid email or password');
        }
        
        // Check if user exists (mock)
        let user = mockUsers.find(u => u.email === data.email);
        
        if (!user) {
          // Create new user for demo
          user = {
            id: mockUsers.length + 1,
            name: data.email.split('@')[0],
            email: data.email,
            role: 'student',
          };
          mockUsers.push(user);
        }
        
        const token = `mock_token_${Date.now()}`;
        return {
          user,
          token,
        };
      }
      
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Register
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Validation
        if (!data.name || !data.email || !data.password) {
          throw new Error('All fields are required');
        }
        
        if (data.password !== data.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (data.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        // Check if email already exists
        if (mockUsers.find(u => u.email === data.email)) {
          throw new Error('Email already registered');
        }
        
        const newUser: User = {
          id: mockUsers.length + 1,
          name: data.name,
          email: data.email,
          role: 'student',
        };
        
        mockUsers.push(newUser);
        
        const token = `mock_token_${Date.now()}`;
        return {
          user: newUser,
          token,
        };
      }
      
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }
        
        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('User not found');
        }
        
        return JSON.parse(userStr);
      }
      
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      if (isDevelopment) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }
      
      await apiClient.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw handleApiError(error);
    }
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('Not authenticated');
        }
        
        const user = JSON.parse(userStr);
        const token = `mock_token_${Date.now()}`;
        return {
          user,
          token,
        };
      }
      
      const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};



