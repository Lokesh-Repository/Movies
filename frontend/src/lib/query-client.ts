import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api';
import { toast } from '../components/ui/toaster';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      networkMode: 'online',
    },
  },
});

queryClient.setMutationDefaults(['entries'], {
  onError: (error) => {
    if (!(error instanceof ApiError)) {
      toast.error('An unexpected error occurred. Please try again.', {
        title: 'Unexpected Error'
      });
    }
  },
});

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    toast.info('Connection restored. Syncing data...', {
      title: 'Back Online'
    });
    queryClient.resumePausedMutations();
    queryClient.invalidateQueries();
  });

  window.addEventListener('offline', () => {
    toast.warning('You are currently offline. Some features may not work.', {
      title: 'Connection Lost',
      duration: 8000
    });
  });
}