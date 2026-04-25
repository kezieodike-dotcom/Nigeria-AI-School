import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error' | 'warning';
  onClose: () => void;
  key?: React.Key;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-secondary" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    error: <X className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "fixed bottom-8 right-8 z-[200] p-4 pr-12 bg-white rounded-2xl shadow-2xl border flex items-center gap-4 min-w-[320px]",
        type === 'success' ? "border-secondary/20" : 
        type === 'error' ? "border-red-200" : "border-outline-variant/10"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        type === 'success' ? "bg-secondary/10" : 
        type === 'error' ? "bg-red-50" : "bg-surface-container-low"
      )}>
        {icons[type]}
      </div>
      <div>
        <p className="text-sm font-bold text-primary">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

type ToastData = { id: number; message: string; type: 'success' | 'info' | 'error' | 'warning' };
let toastListeners: ((toast: ToastData) => void)[] = [];

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const addToast = (toast: ToastData) => {
      setToasts((prev) => [...prev, toast]);
    };
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== addToast);
    };
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </AnimatePresence>
  );
}

window.showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
  const toast = { id: Date.now(), message, type };
  toastListeners.forEach((listener) => listener(toast));
};

declare global {
  interface Window {
    showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  }
}
