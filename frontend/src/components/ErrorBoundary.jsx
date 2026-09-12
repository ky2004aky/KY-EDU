import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('KY EDU Application Error Caught by Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f1f2f4] p-4 text-[#212121]">
          <div className="max-w-md w-full bg-white rounded shadow-md border border-gray-200 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center font-bold text-xl">
              !
            </div>
            <h2 className="text-lg font-bold text-gray-900">Portal Display Issue Recovered</h2>
            <p className="text-xs text-gray-600">
              An unexpected render issue occurred. Click reload to refresh the portal components.
            </p>
            {this.state.error?.message && (
              <div className="bg-red-50 p-2.5 rounded text-[11px] text-red-700 font-mono text-left break-all">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2 bg-[#2874f0] hover:bg-[#1e60c8] text-white font-bold rounded text-xs uppercase tracking-wider transition-colors"
            >
              Reload KY EDU Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
