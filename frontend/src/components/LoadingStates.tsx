import { Loader2 } from 'lucide-react';

// Generic loading spinner component
export function LoadingSpinner({ 
  size = 'default', 
  className = '' 
}: { 
  size?: 'sm' | 'default' | 'lg'; 
  className?: string; 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

// Full page loading overlay
export function PageLoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

// Inline loading state for buttons and small components
export function InlineLoading({ 
  message = 'Loading...', 
  size = 'default' 
}: { 
  message?: string; 
  size?: 'sm' | 'default' | 'lg'; 
}) {
  return (
    <div className="flex items-center justify-center space-x-2 py-2">
      <LoadingSpinner size={size} className="text-gray-500" />
      <span className="text-gray-600 text-sm">{message}</span>
    </div>
  );
}

// Skeleton components for different content types
export function SkeletonText({ 
  lines = 1, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded animate-pulse ${
            index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-4">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="flex items-center space-x-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
      </div>
    </div>
  );
}

export function SkeletonTable({ 
  rows = 5, 
  columns = 8 
}: { 
  rows?: number; 
  columns?: number; 
}) {
  return (
    <div className="rounded-md border">
      <div className="border-b">
        <div className="flex">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="flex-1 p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      <div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex border-b last:border-b-0">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading state for forms
export function FormLoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-blue-600 mb-2" />
        <p className="text-gray-600 text-sm font-medium">Processing...</p>
      </div>
    </div>
  );
}

// Loading state for infinite scroll
export function InfiniteScrollLoading() {
  return (
    <div className="flex justify-center py-6">
      <div className="flex items-center space-x-2 text-gray-600">
        <LoadingSpinner size="default" />
        <span className="text-sm font-medium">Loading more entries...</span>
      </div>
    </div>
  );
}

// Loading state for empty states while loading
export function EmptyStateLoading({ 
  title = 'Loading...', 
  description = 'Please wait while we fetch your data.' 
}: { 
  title?: string; 
  description?: string; 
}) {
  return (
    <div className="text-center py-12">
      <LoadingSpinner size="lg" className="text-gray-400 mb-4 mx-auto" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto">{description}</p>
    </div>
  );
}