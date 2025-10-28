import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense, lazy } from 'react';
import { queryClient } from './lib/query-client';
import { Toaster, toast } from './components/ui/toaster';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageLoadingOverlay } from './components/LoadingStates';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));

function App() {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    toast.error('An unexpected error occurred. Please refresh the page if the problem persists.', {
      title: 'Unexpected Error',
      duration: 8000
    });
  });

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    toast.error('A JavaScript error occurred. Please refresh the page if the problem persists.', {
      title: 'Script Error',
      duration: 8000
    });
  });

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('App Error Boundary caught an error:', error, errorInfo);
        toast.error('The application encountered an error. Please refresh the page.', {
          title: 'Application Error',
          duration: 10000,
          action: {
            label: 'Reload Page',
            onClick: () => window.location.reload()
          }
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary
          fallback={
            <div style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '16px'
                }}>
                  Navigation Error
                </h1>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '24px'
                }}>
                  There was a problem loading the application navigation.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  Reload Application
                </button>
              </div>
            </div>
          }
        >
          <Router>
            <div className="App" style={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <Suspense fallback={<PageLoadingOverlay message="Loading application..." />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                </Routes>
              </Suspense>
              <Toaster />
            </div>
          </Router>
        </ErrorBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
