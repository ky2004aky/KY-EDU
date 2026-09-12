import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Info className="w-5 h-5 text-orange-400" />;
    }
  };

  const getBg = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100';
      case 'error':
        return 'border-rose-500/40 bg-rose-950/90 text-rose-100';
      default:
        return 'border-orange-500/40 bg-slate-900/95 text-slate-100';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${getBg()}`}>
        <div className="shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 text-xs sm:text-sm">
          {toast.title && <h5 className="font-bold mb-0.5">{toast.title}</h5>}
          <p className="opacity-90">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 opacity-70 hover:opacity-100 transition-opacity p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
