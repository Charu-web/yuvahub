import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Sparkles, Download } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, title = '', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, message, title };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, title) => addToast('success', msg, title),
    error: (msg, title) => addToast('error', msg, title),
    info: (msg, title) => addToast('info', msg, title),
    download: (msg, title) => addToast('download', msg, title),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Fixed Toast Container */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-fade-in ${
              t.type === 'success'
                ? 'bg-white/95 border-green-200 text-gray-800 shadow-green-500/10'
                : t.type === 'error'
                ? 'bg-white/95 border-red-200 text-gray-800 shadow-red-500/10'
                : t.type === 'download'
                ? 'bg-white/95 border-orange-200 text-gray-800 shadow-orange-500/10'
                : 'bg-white/95 border-blue-200 text-gray-800 shadow-blue-500/10'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && (
                <div className="size-8 rounded-full bg-green-100 text-green-600 grid place-items-center">
                  <CheckCircle2 className="size-5 stroke-[2.5]" />
                </div>
              )}
              {t.type === 'error' && (
                <div className="size-8 rounded-full bg-red-100 text-red-600 grid place-items-center">
                  <AlertCircle className="size-5 stroke-[2.5]" />
                </div>
              )}
              {t.type === 'download' && (
                <div className="size-8 rounded-full bg-orange-100 text-primary grid place-items-center">
                  <Download className="size-5 stroke-[2.5]" />
                </div>
              )}
              {t.type === 'info' && (
                <div className="size-8 rounded-full bg-blue-100 text-blue-600 grid place-items-center">
                  <Info className="size-5 stroke-[2.5]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {t.title && (
                <h5
                  className={`text-xs sm:text-sm font-extrabold leading-tight ${
                    t.type === 'success'
                      ? 'text-green-800'
                      : t.type === 'error'
                      ? 'text-red-800'
                      : t.type === 'download'
                      ? 'text-primary'
                      : 'text-blue-800'
                  }`}
                >
                  {t.title}
                </h5>
              )}
              <p className="text-xs text-gray-600 font-medium mt-0.5 leading-snug">
                {t.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
