import React, { createContext, useState, useCallback, useContext } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    const safeMessage = typeof message === 'string' ? message : String(message);
    
    setToasts(prev => [...prev, { id, message: safeMessage, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-2xl animate-toast-slide-up backdrop-blur-md border ${
            t.type === 'success' ? 'bg-emerald-900 bg-opacity-90 border-emerald-500 border-opacity-50 text-emerald-50' :
            t.type === 'warning' ? 'bg-amber-900 bg-opacity-90 border-amber-500 border-opacity-50 text-amber-50' : 
            'bg-red-900 bg-opacity-90 border-red-500 border-opacity-50 text-red-50'
          }`}>
            {t.type === 'success' ? <CheckCircle2 className="text-emerald-400" size={20} /> :
             <AlertTriangle className={t.type === 'warning' ? "text-amber-400" : "text-red-400"} size={20} />}
            <p className="text-sm font-medium">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);