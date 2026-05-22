// @ts-nocheck
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-outline-variant/10 shadow-2xl space-y-8 animate-[fadeIn_0.5s_ease]">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-headline font-black text-primary">Something went wrong</h1>
              <p className="text-on-surface-variant font-medium">
                The application encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <RotateCcw size={20} /> Reload Application
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="w-full py-4 bg-white text-primary border-2 border-outline-variant/10 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-surface-container-low transition-all"
              >
                <Home size={20} /> Back to Home
              </Link>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="pt-6 border-t border-outline-variant/10">
                <p className="text-[10px] font-mono text-red-500 bg-red-50 p-4 rounded-xl text-left overflow-auto max-h-32">
                  {this.state.error?.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
