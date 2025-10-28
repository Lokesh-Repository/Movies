const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Entry {
  id: string;
  title: string;
  type: 'MOVIE' | 'TV_SHOW';
  director: string;
  budget: string;
  location: string;
  duration: string;
  year: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntryFormData {
  title: string;
  type: 'MOVIE' | 'TV_SHOW';
  director: string;
  budget: string;
  location: string;
  duration: string;
  year: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: any;

  constructor(message: string, code: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static isNetworkError(error: unknown): error is ApiError {
    return error instanceof ApiError && error.code === 'NETWORK_ERROR';
  }

  static isTimeoutError(error: unknown): error is ApiError {
    return error instanceof ApiError && error.code === 'TIMEOUT_ERROR';
  }

  static isValidationError(error: unknown): error is ApiError {
    return error instanceof ApiError && (error.status === 400 || error.status === 422);
  }

  static isServerError(error: unknown): error is ApiError {
    return error instanceof ApiError && error.status >= 500;
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: {
              message: this.getHttpErrorMessage(response.status),
              code: `HTTP_${response.status}`,
            }
          };
        }
        
        const error = new ApiError(
          errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.error?.code || `HTTP_${response.status}`,
          response.status,
          errorData.error?.details
        );
        
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Network connection failed. Please check your internet connection.',
          'NETWORK_ERROR',
          0
        );
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(
          'Request timed out. Please try again.',
          'TIMEOUT_ERROR',
          0
        );
      }
      
      if (error instanceof Error) {
        throw new ApiError(error.message, 'UNKNOWN_ERROR', 0);
      }
      
      throw new ApiError('An unexpected error occurred', 'UNKNOWN_ERROR', 0);
    }
  }

  private getHttpErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please log in and try again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'Conflict detected. The resource may have been modified by another user.';
      case 422:
        return 'Validation failed. Please check your input and try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error occurred. Please try again later.';
      case 502:
        return 'Service temporarily unavailable. Please try again later.';
      case 503:
        return 'Service maintenance in progress. Please try again later.';
      default:
        return `Server responded with status ${status}. Please try again.`;
    }
  }

  async getEntries(cursor?: string, limit: number = 20): Promise<PaginatedResponse<Entry>> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());
    
    const response = await this.request<ApiResponse<PaginatedResponse<Entry>>>(
      `/api/entries?${params.toString()}`
    );
    
    if (!response.success) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  }

  async createEntry(data: EntryFormData): Promise<Entry> {
    const response = await this.request<ApiResponse<Entry>>('/api/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.success) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  }

  async updateEntry(id: string, data: Partial<EntryFormData>): Promise<Entry> {
    const response = await this.request<ApiResponse<Entry>>(`/api/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (!response.success) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  }

  async deleteEntry(id: string): Promise<void> {
    const response = await this.request<ApiResponse<{ message: string }>>(`/api/entries/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.success) {
      throw new Error(response.error.message);
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);