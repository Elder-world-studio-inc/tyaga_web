import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-gray-900 text-white h-screen overflow-auto">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h1>
          <h2 className="text-xl font-semibold mb-2">Error:</h2>
          <pre className="bg-black p-4 rounded mb-4 text-red-300 overflow-x-auto">
            {this.state.error && this.state.error.toString()}
          </pre>
          <h2 className="text-xl font-semibold mb-2">Component Stack:</h2>
          <pre className="bg-black p-4 rounded text-gray-300 text-sm overflow-x-auto">
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
