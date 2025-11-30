import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// الحصول على الـ API URL من environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://parasites-api-boubetana.onrender.com/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT ? parseInt(import.meta.env.VITE_API_TIMEOUT) : 10000;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8',
  },
  timeout: API_TIMEOUT,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API calls in development
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log(`[API Response] ${response.status} ${response.statusText}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('[API] Access Forbidden');
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('[API] Resource not found');
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('[API] Server error');
    }
    
    // Log network errors
    if (error.code === 'ECONNABORTED') {
      console.error('[API] Request timeout');
    }
    
    if (!error.response) {
      console.error('[API] Network error - unable to reach server');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// Error types
export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || 
                   error.response?.data?.detail || 
                   error.message || 
                   'حدث خطأ في الاتصال';
    
    return {
      message,
      status: error.response?.status,
      data: error.response?.data,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  return {
    message: 'حدث خطأ غير متوقع',
  };
};

// Log API configuration in development
if (import.meta.env.VITE_DEBUG_MODE === 'true') {
  console.log('[API Config]', {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
  });
}
