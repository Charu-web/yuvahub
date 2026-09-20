import React from 'react';
import { RotateCw, AlertTriangle, Home } from 'lucide-react';

/**
 * Global React Error Boundary Fallback Component
 * Prevents any unhandled runtime React exception from displaying a blank white page.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary Caught Exception]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF7ED] flex flex-col items-center justify-center p-6 text-center text-gray-900 font-sans selection:bg-[#FF7A00] selection:text-white">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-orange-200 shadow-2xl shadow-orange-500/10">
            <div className="size-16 rounded-2xl bg-orange-100 text-[#F05A00] border border-orange-200 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="size-8 text-[#FF7A00]" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">काही तांत्रिक अडचण आली आहे</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
              पृष्ठ दर्शवताना एक क्षणिक त्रुटी आली. कृपया पृष्ठ रीलोड करा किंवा मुख्य पृष्ठावर जा.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  window.history.replaceState({}, '', '/');
                  window.location.reload();
                }}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Home className="size-4" />
                <span>मुखपृष्ठावर जा</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCw className="size-4" />
                <span>रीलोड करा</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
