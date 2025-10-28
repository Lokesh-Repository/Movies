export type { Entry, EntryType } from '../generated/prisma';

export interface EntryCreateRequest {
  title: string;
  type: 'MOVIE' | 'TV_SHOW';
  director: string;
  budget: string;
  location: string;
  duration: string;
  year: string;
}

export interface EntryUpdateRequest extends Partial<EntryCreateRequest> {
  id: string;
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