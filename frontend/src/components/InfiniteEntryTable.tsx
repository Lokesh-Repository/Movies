import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useInfiniteEntries } from '../hooks/useEntries';
import { EntryTable } from './EntryTable';
import { InfiniteScrollLoading } from './LoadingStates';
import { Button } from './ui/button';
import { Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { type Entry, ApiError } from '../lib/api';

interface InfiniteEntryTableProps {
  onEdit?: (entry: Entry) => void;
  onDelete?: (entry: Entry) => void;
}

export function InfiniteEntryTable({ onEdit, onDelete }: InfiniteEntryTableProps) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteEntries();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Memoize flattened entries to prevent unnecessary re-renders
  const allEntries = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data?.pages]);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver]);

  // Loading state for initial load
  if (status === 'pending') {
    return (
      <div className="space-y-4">
        <EntryTable entries={[]} isLoading={true} />
      </div>
    );
  }

  // Error state with enhanced error handling
  if (status === 'error') {
    const isNetworkError = error instanceof ApiError && ApiError.isNetworkError(error);
    const isServerError = error instanceof ApiError && ApiError.isServerError(error);
    
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              {isNetworkError ? (
                <WifiOff className="h-8 w-8 text-red-600" />
              ) : (
                <RefreshCw className="h-8 w-8 text-red-600" />
              )}
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-red-900 mb-2">
            {isNetworkError ? 'Connection Problem' : 'Failed to Load Entries'}
          </h3>
          
          <p className="text-red-700 mb-4 text-sm">
            {isNetworkError 
              ? 'Please check your internet connection and try again.'
              : isServerError
              ? 'The server is experiencing issues. Please try again in a few moments.'
              : error?.message || 'An unexpected error occurred while loading your entries.'
            }
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="w-full"
            >
              {isFetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  {isNetworkError ? (
                    <Wifi className="mr-2 h-4 w-4" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Try Again
                </>
              )}
            </Button>
            
            {isNetworkError && (
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Reload Page
              </Button>
            )}
          </div>
          
          {import.meta.env.DEV && error && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-red-800 bg-red-100 p-2 rounded overflow-auto max-h-32">
                {error.message}
                {error instanceof ApiError && error.code && ` (${error.code})`}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main table */}
      <EntryTable 
        entries={allEntries} 
        onEdit={onEdit} 
        onDelete={onDelete}
        isLoading={false}
      />

      {/* Infinite scroll trigger and loading indicator */}
      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage && <InfiniteScrollLoading />}
        
        {!hasNextPage && allEntries.length > 0 && (
          <div className="text-center text-gray-500 py-4">
            <div className="inline-flex items-center space-x-2">
              <div className="h-px bg-gray-300 w-16"></div>
              <span className="text-sm">You've reached the end</span>
              <div className="h-px bg-gray-300 w-16"></div>
            </div>
          </div>
        )}

        {/* Fallback load more button for cases where intersection observer might not work */}
        {hasNextPage && !isFetchingNextPage && allEntries.length > 0 && (
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-4"
          >
            Load More
          </Button>
        )}
      </div>

      {/* Empty state is handled by EntryTable component */}
    </div>
  );
}