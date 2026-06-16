import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
          <div className="max-w-md w-full mx-4 p-8 bg-tertiary rounded-2xl shadow-card">
            <div className="text-center">
              <h2 className="text-white text-2xl font-bold mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-secondary text-sm mb-6">
                {this.props.fallbackMessage ||
                  "We're sorry, but something unexpected happened. Please try refreshing the page."}
              </p>

              {/* Show error details in development */}
              {import.meta.env.DEV && this.state.error && (
                <details className="text-left mb-6 p-4 bg-black-200/50 rounded-lg">
                  <summary className="text-white cursor-pointer mb-2 font-medium">
                    Error Details (Development Only)
                  </summary>
                  <div className="text-xs text-red-400 space-y-2">
                    <p className="font-mono break-all">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="whitespace-pre-wrap overflow-auto max-h-48 p-2 bg-black/30 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-3 bg-tertiary border border-secondary/20 rounded-lg text-white font-medium hover:bg-black-200 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-[#915EFF] rounded-lg text-white font-medium hover:bg-[#7c4ee0] transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;