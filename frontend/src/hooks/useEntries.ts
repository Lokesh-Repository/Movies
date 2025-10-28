import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient, type EntryFormData, ApiError } from '../lib/api';
import { toast } from '../components/ui/toaster';

export const QUERY_KEYS = {
  entries: ['entries'] as const,
  entry: (id: string) => ['entries', id] as const,
};

export function useInfiniteEntries(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.entries,
    queryFn: ({ pageParam }) => apiClient.getEntries(pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    staleTime: 5 * 60 * 1000, 
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EntryFormData) => apiClient.createEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries });
      toast.success('Entry created successfully!');
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (ApiError.isNetworkError(error)) {
          toast.networkError(error);
        } else if (ApiError.isValidationError(error)) {
          toast.error((error as any).message, { title: 'Validation Error' });
        } else if (ApiError.isServerError(error)) {
          toast.error('Server error occurred while creating entry. Please try again.', {
            title: 'Server Error',
            action: {
              label: 'Retry',
              onClick: () => window.location.reload()
            }
          });
        } else {
          toast.apiError(error, 'Create Entry');
        }
      } else if (error instanceof Error) {
        toast.error(error.message || 'Failed to create entry');
      } else {
        toast.error('Failed to create entry');
      }
    },
    retry: 2,
  });
}

export function useUpdateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EntryFormData> }) =>
      apiClient.updateEntry(id, data),
    onSuccess: (updatedEntry) => {
      queryClient.setQueryData(QUERY_KEYS.entry(updatedEntry.id), updatedEntry);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries });
      toast.success('Entry updated successfully!');
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (ApiError.isNetworkError(error)) {
          toast.networkError(error);
        } else if ((error as any).status === 404) {
          toast.error('Entry not found. It may have been deleted by another user.', {
            title: 'Entry Not Found',
            action: {
              label: 'Refresh',
              onClick: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries })
            }
          });
        } else if (ApiError.isValidationError(error)) {
          toast.error((error as any).message, { title: 'Validation Error' });
        } else if (ApiError.isServerError(error)) {
          toast.error('Server error occurred while updating entry. Please try again.', {
            title: 'Server Error'
          });
        } else {
          toast.apiError(error, 'Update Entry');
        }
      } else if (error instanceof Error) {
        toast.error(error.message || 'Failed to update entry');
      } else {
        toast.error('Failed to update entry');
      }
    },
    retry: 2,
  });
}

export function useEntries() {
  return useInfiniteEntries(50);
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries });
      toast.success('Entry deleted successfully!');
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (ApiError.isNetworkError(error)) {
          toast.networkError(error);
        } else if ((error as any).status === 404) {
          toast.warning('Entry was already deleted or not found.', {
            title: 'Entry Not Found',
            action: {
              label: 'Refresh',
              onClick: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries })
            }
          });
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries });
        } else if (ApiError.isServerError(error)) {
          toast.error('Server error occurred while deleting entry. Please try again.', {
            title: 'Server Error'
          });
        } else {
          toast.apiError(error, 'Delete Entry');
        }
      } else if (error instanceof Error) {
        toast.error(error.message || 'Failed to delete entry');
      } else {
        toast.error('Failed to delete entry');
      }
    },
    retry: 2,
  });
}