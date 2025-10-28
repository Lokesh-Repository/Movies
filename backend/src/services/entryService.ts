import prisma from '../lib/prisma';
import { EntryCreateInput, EntryUpdateInput } from '../schemas/entry';
import { ApiError } from '../middleware/errorHandler';

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
}

export class EntryService {
  /**
   * Get entries with cursor-based pagination for infinite scroll
   */
  static async getEntries(
    cursor?: string,
    limit: number = 20
  ): Promise<PaginatedResult<any>> {
    try {
      const safeLimit = Math.min(Math.max(limit, 1), 100);
      
      const queryOptions: any = {
        take: safeLimit + 1, 
        orderBy: {
          createdAt: 'desc' as const,
        },
      };

      if (cursor) {
        queryOptions.cursor = {
          id: cursor,
        };
        queryOptions.skip = 1; 
      }

      const entries = await prisma.entry.findMany(queryOptions);

      const hasMore = entries.length > safeLimit;
      
      if (hasMore) {
        entries.pop();
      }

      const nextCursor = hasMore && entries.length > 0 
        ? entries[entries.length - 1].id 
        : undefined;

      return {
        data: entries,
        hasMore,
        nextCursor,
      };
    } catch (error) {
      console.error('Error fetching entries:', error);
      const apiError = new Error('Failed to fetch entries') as ApiError;
      apiError.statusCode = 500;
      apiError.code = 'FETCH_ENTRIES_ERROR';
      throw apiError;
    }
  }

  /**
   * Get a single entry by ID
   */
  static async getEntryById(id: string) {
    try {
      const entry = await prisma.entry.findUnique({
        where: { id },
      });

      if (!entry) {
        const error = new Error('Entry not found') as ApiError;
        error.statusCode = 404;
        error.code = 'ENTRY_NOT_FOUND';
        throw error;
      }

      return entry;
    } catch (error) {
      if ((error as ApiError).statusCode === 404) {
        throw error;
      }
      
      console.error('Error fetching entry by ID:', error);
      const apiError = new Error('Failed to fetch entry') as ApiError;
      apiError.statusCode = 500;
      apiError.code = 'FETCH_ENTRY_ERROR';
      throw apiError;
    }
  }

  /**
   * Create a new entry
   */
  static async createEntry(data: EntryCreateInput) {
    try {
      const entry = await prisma.entry.create({
        data,
      });

      return entry;
    } catch (error) {
      console.error('Error creating entry:', error);
      
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        const apiError = new Error('Entry with this title already exists') as ApiError;
        apiError.statusCode = 409;
        apiError.code = 'DUPLICATE_ENTRY';
        throw apiError;
      }

      const apiError = new Error('Failed to create entry') as ApiError;
      apiError.statusCode = 500;
      apiError.code = 'CREATE_ENTRY_ERROR';
      throw apiError;
    }
  }

  /**
   * Update an existing entry
   */
  static async updateEntry(id: string, data: EntryUpdateInput) {
    try {
      await this.getEntryById(id);

      const updatedEntry = await prisma.entry.update({
        where: { id },
        data,
      });

      return updatedEntry;
    } catch (error) {
      if ((error as ApiError).statusCode === 404) {
        throw error;
      }

      console.error('Error updating entry:', error);
      
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        const apiError = new Error('Entry with this title already exists') as ApiError;
        apiError.statusCode = 409;
        apiError.code = 'DUPLICATE_ENTRY';
        throw apiError;
      }

      const apiError = new Error('Failed to update entry') as ApiError;
      apiError.statusCode = 500;
      apiError.code = 'UPDATE_ENTRY_ERROR';
      throw apiError;
    }
  }

  /**
   * Delete an entry
   */
  static async deleteEntry(id: string) {
    try {
      await this.getEntryById(id);

      await prisma.entry.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      if ((error as ApiError).statusCode === 404) {
        throw error;
      }

      console.error('Error deleting entry:', error);
      const apiError = new Error('Failed to delete entry') as ApiError;
      apiError.statusCode = 500;
      apiError.code = 'DELETE_ENTRY_ERROR';
      throw apiError;
    }
  }

  /**
   * Get total count of entries (for statistics)
   */
  static async getEntryCount(): Promise<number> {
    try {
      return await prisma.entry.count();
    } catch (error) {
      console.error('Error getting entry count:', error);
      const apiError = new Error('Failed to get entry count') as ApiError;
      apiError.statusCode = 500;
      apiError.code = 'COUNT_ENTRIES_ERROR';
      throw apiError;
    }
  }

  /**
   * Search entries by title (for future search functionality)
   */
  static async searchEntries(
    searchTerm: string,
    cursor?: string,
    limit: number = 20
  ): Promise<PaginatedResult<any>> {
    try {
      const safeLimit = Math.min(Math.max(limit, 1), 100);
      
      const queryOptions: any = {
        where: {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        take: safeLimit + 1,
        orderBy: {
          createdAt: 'desc' as const,
        },
      };

      if (cursor) {
        queryOptions.cursor = { id: cursor };
        queryOptions.skip = 1;
      }

      const entries = await prisma.entry.findMany(queryOptions);

      const hasMore = entries.length > safeLimit;
      if (hasMore) {
        entries.pop();
      }

      const nextCursor = hasMore && entries.length > 0 
        ? entries[entries.length - 1].id 
        : undefined;

      return {
        data: entries,
        hasMore,
        nextCursor,
      };
    } catch (error) {
      console.error('Error searching entries:', error);
      const apiError = new Error('Failed to search entries') as ApiError;
      apiError.statusCode = 500;
      apiError.code = 'SEARCH_ENTRIES_ERROR';
      throw apiError;
    }
  }
}